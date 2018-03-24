using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToDoBackend.Core.Models
{
    [Table("ToDos")]
    public class ToDo
    {        
        public int Id { get; set; }

        [Required]
        [MaxLength]
        public string Name { get; set; }

        public bool Done { get; set; }

        public int PriorityId { get; set; }

        public Priority Priority { get; set; }
    }
}