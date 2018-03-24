using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using ToDoBackend.Core;
using ToDoBackend.Core.Models;
using ToDoBackend.Extensions;

namespace ToDoBackend.Repositories
{
    public class ToDoRepository : IToDoRepository
    {
        private readonly ToDoDbContext context;

        public ToDoRepository(ToDoDbContext context)
        {
            this.context = context;
        }

        public async Task<ToDo> GetToDo(int id, bool includeRelated = true)
        {
            if (!includeRelated)
                return await context.ToDos.FindAsync(id);

            return await context.ToDos
              .Include(v => v.Priority)
              .SingleOrDefaultAsync(v => v.Id == id);
        }

        public void Add(ToDo todo)
        {
            context.ToDos.Add(todo);
        }

        public void Remove(ToDo todo)
        {
            context.Remove(todo);
        }

        public async Task<QueryResult<ToDo>> GetToDos(ToDoQuery queryObj)
        {
            var result = new QueryResult<ToDo>();

            var query = context.ToDos
              .Include(v => v.Priority)
              .AsQueryable();

            query = query.ApplyFiltering(queryObj);

            var columnsMap = new Dictionary<string, Expression<Func<ToDo, object>>>()
            {
                ["priority"] = v => v.Priority.Name,
                ["name"] = v => v.Name,
                ["done"] = v => v.Done
            };
            query = query.ApplyOrdering(queryObj, columnsMap);

            result.TotalItems = await query.CountAsync();

            query = query.ApplyPaging(queryObj);

            result.Items = await query.ToListAsync();

            return result;
        }
    }
}
