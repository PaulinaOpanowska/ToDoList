using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoBackend.Controllers.Resources
{
    public class SaveToDoResource
    {
        public int Id { get; set; }
        public int PriorityId { get; set; }
        public string Name { get; set; }
        public bool Done { get; set; }
    }
}
