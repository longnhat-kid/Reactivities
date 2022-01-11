using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollow> UserFollows { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(builder =>
            {
                builder.HasKey(aa => new { aa.AppUserId, aa.ActivityId });

                builder.HasOne(u => u.AppUser)
                .WithMany(a => a.Activities)
                .HasForeignKey(aa => aa.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(u => u.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId)
                .OnDelete(DeleteBehavior.Cascade);
            });
                
            builder.Entity<Comment>()
                .HasOne(c => c.Activity)
                .WithMany(a => a.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollow>(builder =>
            {
                builder.HasKey(u => new { u.TargetId, u.ObserverId });

                builder.HasOne(u => u.Target)
                    .WithMany(t => t.Followers)
                    .HasForeignKey(u => u.TargetId)
                    .OnDelete(DeleteBehavior.Cascade);

                builder.HasOne(u => u.Observer)
                    .WithMany(o => o.Followings)
                    .HasForeignKey(u => u.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}

// dotnet ef migrations add [migration name] -p [project contain data context] -s [startup project]
// // dotnet ef migrations remove [migration name] -p [project contain data context] -s [startup project]