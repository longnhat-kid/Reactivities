using Application.Core;
using System;

namespace Application.Activities
{
    public class ActivityParams : PagingParams
    {
        public bool IsGoing { get; set; } = false;
        public bool IsHost { get; set; } = false;
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}
