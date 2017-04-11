using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AudioVisualModule.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [DataType(DataType.MultilineText)]
        public string Description { get; set; }
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [Display(Name = "Email")]
        public string UserEmail { get; set; }
        
    }
}
