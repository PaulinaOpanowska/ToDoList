using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoBackend.Core;

namespace ToDoBackend.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ToDoDbContext context;

        public UnitOfWork(ToDoDbContext context)
        {
            this.context = context;
        }

        public async Task CompleteAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}
