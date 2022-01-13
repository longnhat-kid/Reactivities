using Application.Core;
using Application.DTOs;
using Application.Interface;
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

namespace Application.Profiles
{
    public class Event
    {
        public class Query : IRequest<Result<List<UserActivityDTO>>>{
            public string UserName { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<UserActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                            .Where(a => a.AppUser.UserName == request.UserName)
                            .OrderBy(a => a.Activity.Date)
                            .ProjectTo<UserActivityDTO>(_mapper.ConfigurationProvider)
                            .AsQueryable();


                query = request.Predicate switch
                {
                    "past" => query.Where(a => a.Date <= DateTime.UtcNow),
                    "future" => query.Where(a => a.Date >= DateTime.UtcNow),
                    _ => query.Where(a => a.HostUserName == request.UserName)
                };

                var activityList = await query.ToListAsync();

                return Result<List<UserActivityDTO>>.Success(activityList);
            }
        }
    }
}
