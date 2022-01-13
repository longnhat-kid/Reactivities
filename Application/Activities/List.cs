using Application.Core;
using Application.DTOs;
using Application.Interface;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDTO>>>
        {
            public ActivityParams ActivityParams { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDTO>>>
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

            public async Task<Result<PagedList<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(a => a.Date >= request.ActivityParams.StartDate)
                    .OrderBy(a => a.Date)
                    .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider, new { currentUserName = _userAccessor.GetUserName() })
                    .AsQueryable();

                if(request.ActivityParams.IsGoing && !request.ActivityParams.IsHost)
                {
                    query = query.Where(a => a.Attendees.Any(x => x.UserName == _userAccessor.GetUserName()));
                }

                if(request.ActivityParams.IsHost && !request.ActivityParams.IsGoing)
                {
                    query = query.Where(a => a.HostUserName == _userAccessor.GetUserName());
                }

                var result = await PagedList<ActivityDTO>.CreateAsync(query, request.ActivityParams.PageNumber, request.ActivityParams.PageSize);

                return Result<PagedList<ActivityDTO>>.Success(result);
            }
        }
    }
}
