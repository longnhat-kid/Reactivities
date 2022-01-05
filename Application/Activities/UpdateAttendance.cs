using Application.Core;
using Application.Interface;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(a => a.Attendees).ThenInclude(aa => aa.AppUser)
                    .FirstOrDefaultAsync(a => a.Id == request.Id);
                if (activity == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var hostUserName = activity.Attendees.FirstOrDefault(a => a.IsHost)?.AppUser.UserName;
                var attendee = activity.Attendees
                    .FirstOrDefault(a => a.AppUser.UserName == user.UserName);
                
                // Nếu user đang là host => toggle status của activity
                if(hostUserName == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }

                // Nếu user không phải host và đang là người tham gia vào activity này => bỏ tham gia activity
                else if(hostUserName != user.UserName && attendee != null)
                {
                    activity.Attendees.Remove(attendee);
                }

                // Nếu user không phải host và chưa tham gia vào activity này => tham gia activity
                else if (attendee == null)
                {
                    attendee = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendee);
                }

                var result = await _context.SaveChangesAsync() > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance !");
            }
        }
    }
}
