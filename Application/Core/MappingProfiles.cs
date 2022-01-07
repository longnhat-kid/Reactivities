using Application.Activities;
using Application.DTOs.Activities;
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
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDTO>()
                .ForMember(x => x.HostUserName, opt => opt.MapFrom(a => a.Attendees
                    .FirstOrDefault(aa => aa.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, AttendeeDTO>()
                .ForMember(x => x.DisplayName, opt => opt.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(x => x.UserName, opt => opt.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(x => x.MainPhoto, opt => opt.MapFrom(aa => aa.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(x => x.Bio, opt => opt.MapFrom(aa => aa.AppUser.Bio));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(x => x.MainPhoto, opt => opt.MapFrom(u => u.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}
