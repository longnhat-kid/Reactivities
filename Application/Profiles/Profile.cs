using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class Profile
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string MainPhoto { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public bool isFollowing { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingsCount { get; set; }
    }
}
