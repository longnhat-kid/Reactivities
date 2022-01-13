using Application.Activities;
using Application.DTOs;
using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUserName = null;

            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDTO>()
                .ForMember(x => x.HostUserName, opt => opt.MapFrom(a => a.Attendees
                    .FirstOrDefault(aa => aa.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, UserActivityDTO>()
                .ForMember(x => x.Id, opt => opt.MapFrom(a => a.ActivityId))
                .ForMember(x => x.Title, opt => opt.MapFrom(a => a.Activity.Title))
                .ForMember(x => x.Category, opt => opt.MapFrom(a => a.Activity.Category))
                .ForMember(x => x.Date, opt => opt.MapFrom(a => a.Activity.Date))
                .ForMember(x => x.HostUserName, opt => opt.MapFrom(a => a.Activity.Attendees.FirstOrDefault(z => z.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDTO>()
                .ForMember(x => x.DisplayName, opt => opt.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(x => x.UserName, opt => opt.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(x => x.MainPhoto, opt => opt.MapFrom(aa => aa.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(x => x.Bio, opt => opt.MapFrom(aa => aa.AppUser.Bio))
                .ForMember(x => x.FollowersCount, opt => opt.MapFrom(u => u.AppUser.Followers.Count))
                .ForMember(x => x.FollowingsCount, opt => opt.MapFrom(u => u.AppUser.Followings.Count))
                .ForMember(x => x.isFollowing, opt => opt.MapFrom(u => u.AppUser.Followers.Any(f => f.Observer.UserName == currentUserName)));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(x => x.MainPhoto, opt => opt.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(x => x.FollowersCount, opt => opt.MapFrom(u => u.Followers.Count))
                .ForMember(x => x.FollowingsCount, opt => opt.MapFrom(u => u.Followings.Count))
                .ForMember(x => x.isFollowing, opt => opt.MapFrom(u => u.Followers.Any(f => f.Observer.UserName == currentUserName)));

            CreateMap<Comment, CommentDTO>()
                .ForMember(co => co.UserName, opt => opt.MapFrom(c => c.Author.UserName))
                .ForMember(co => co.DisplayName, opt => opt.MapFrom(c => c.Author.DisplayName))
                .ForMember(co => co.Photo, opt => opt.MapFrom(c => c.Author.Photos.FirstOrDefault(p => p.IsMain).Url));

        }
    }
}
