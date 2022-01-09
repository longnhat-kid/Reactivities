using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace API.SignalRHub
{
    public class CommentHub : Hub
    {
        private readonly IMediator _mediator;

        public CommentHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);
            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            string activityId = httpContext.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            var comments = await _mediator.Send(new List.Query { ActivityId = Guid.Parse(activityId) });

            await Clients.Caller.SendAsync("LoadComments", comments.Value);
        }
    }
}
