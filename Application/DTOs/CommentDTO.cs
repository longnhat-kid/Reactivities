using Application.Profiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public DateTime CreateAt { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Photo { get; set; }
    }
}
