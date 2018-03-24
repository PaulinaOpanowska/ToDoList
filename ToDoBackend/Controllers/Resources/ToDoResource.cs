using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoBackend.Controllers.Resources
{
    public class ToDoResource
    {
        public int Id { get; set; }
        public PriorityResource Priority { get; set; }
        public bool Done { get; set; }
        public string Name { get; set; }
    }
}
