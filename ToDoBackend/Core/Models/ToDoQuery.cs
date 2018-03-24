using ToDoBackend.Extensions;

namespace ToDoBackend.Core.Models
{
    public class ToDoQuery : IQueryObject
    {
        public int? PriorityId { get; set; }
        public string Name { get; set; }
        public string SortBy { get; set; }
        public bool IsSortAscending { get; set; }
        public int Page { get; set; }
        public byte PageSize { get; set; }
    }
}
