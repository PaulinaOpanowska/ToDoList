using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoBackend.Controllers.Resources
{
    public class ToDoQueryResource
    {
        public int? PriorityId { get; set; }
        public string Name { get; set; }
        public string SortBy { get; set; }
        public bool IsSortAscending { get; set; }
        public int Page { get; set; }
        public byte PageSize { get; set; }
    }
}
