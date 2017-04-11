using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AudioVisualModule.Models
{
    public class Files
    {
        public int Id { get; set; }

        public string FileName { get; set; }
        public string FilePath { get; set; }
        public DateTime DateCreated { get; set; }

        public string EventId { get; set; }
        public virtual IEnumerable<Event> Events { get; set; }

    }
}
