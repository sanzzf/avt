using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;
using AudioVisualModule.Models;

namespace AudioVisualModule.DAL
{
    public class AudioVisualDataContext : IdentityDbContext
    {
        public AudioVisualDataContext() : base("name=AudioVisual")
        {

        }
        public static AudioVisualDataContext Create()
        {
            return new AudioVisualDataContext();
        }
        public DbSet<Files> Files { get; set; }
        public DbSet<Event> Event { get; set; }
    }
}
