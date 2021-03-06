using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ToDoBackend.Core.Models
{
    [Table("Priorities")]
    public class Priority
    {
       public int Id { get; set; }
       
       [Required]
       [StringLength(255)]
       public string Name { get; set; } 
    }
}