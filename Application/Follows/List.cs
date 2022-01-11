using Application.Core;
using Application.Interface;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>{
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<Profiles.Profile> profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollows.Where(x => x.Target.UserName == request.UserName)
                            .Select(x => x.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new {currentUserName = _userAccessor.GetUserName()})
                            .ToListAsync();
                        break;
                    case "followings":
                        profiles = await _context.UserFollows.Where(x => x.Observer.UserName == request.UserName)
                            .Select(x => x.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { currentUserName = _userAccessor.GetUserName() })
                            .ToListAsync();
                        break;
                    default:
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}
