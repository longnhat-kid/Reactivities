using Application.Core;
using Application.DTOs;
using Application.Interface;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDTO>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(c => c.Body).NotEmpty().WithMessage("Body of comment must be non-empty");
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDTO>>
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

            public async Task<Result<CommentDTO>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FirstOrDefaultAsync(a => a.Id == request.ActivityId);

                if (activity == null) return null;

                var user = await _context.Users
                    .Include(u => u.Photos)
                    .SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                var comment = new Comment
                {
                    Body = request.Body,
                    Author = user,
                    Activity = activity,
                };

                activity.Comments.Add(comment);

                var result = await _context.SaveChangesAsync() > 0;

                var commentDto = _mapper.Map<CommentDTO>(comment);

                return result ? Result<CommentDTO>.Success(commentDto) : Result<CommentDTO>.Failure("Problem to create comment");
            }
        }
    }
}
