using Application.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class ActivityParams : PagingParams
    {
        public bool IsGoing { get; set; } = false;
        public bool IsHost { get; set; } = false;
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}
