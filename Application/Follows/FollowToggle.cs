using Application.Core;
using Application.Interface;
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

namespace Application.Follows
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUserName { get; set; }
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
                var target = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == request.TargetUserName);

                if (target == null) return null;

                var observer = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

                var following = await _context.UserFollows.FindAsync(target.Id, observer.Id);

                if (following == null)
                {
                    following = new UserFollow
                    {
                        Observer = observer,
                        Target = target
                    };
                    _context.UserFollows.Add(following);
                }
                else
                {
                    _context.UserFollows.Remove(following);
                }

                var result = await _context.SaveChangesAsync() > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}
