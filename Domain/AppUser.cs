using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; } = new List<ActivityAttendee>();
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
        public ICollection<UserFollow> Followers { get; set; } = new List<UserFollow>();
        public ICollection<UserFollow> Followings { get; set; } = new List<UserFollow>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
