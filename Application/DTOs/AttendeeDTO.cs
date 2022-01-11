using Application.Profiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class AttendeeDTO
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string MainPhoto { get; set; }
        public bool isFollowing { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingsCount { get; set; }
    }
}
