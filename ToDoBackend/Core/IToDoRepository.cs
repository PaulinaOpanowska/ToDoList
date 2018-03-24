using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoBackend.Core.Models;

namespace ToDoBackend.Core
{
    public interface IToDoRepository
    {
        Task<ToDo> GetToDo(int id, bool includeRelated = true);
        void Add(ToDo todo);
        void Remove(ToDo todo);
        Task<QueryResult<ToDo>> GetToDos(ToDoQuery filter);
    }
}
