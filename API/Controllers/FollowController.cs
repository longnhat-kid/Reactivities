using Application.Follows;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPut("{username}")]
        public async Task<IActionResult> UpdateFollowing(string username)
        {
            var result = await Mediator.Send(new FollowToggle.Command { TargetUserName = username });
            return HandleResult(result);
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetListFollows(string username, string predicate)
        {
            var result = await Mediator.Send(new List.Query { UserName = username, Predicate = predicate });
            return HandleResult(result);
        }
    }
}
