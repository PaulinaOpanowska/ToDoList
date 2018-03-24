using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoBackend.Controllers.Resources;
using ToDoBackend.Core;
using ToDoBackend.Core.Models;
using ToDoBackend.Repositories;

namespace ToDoBackend.Controllers
{
    [Produces("application/json")]
    [Route("api/Home")]
    public class HomeController : Controller
    {
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;
        private readonly IToDoRepository repository;
        private readonly ToDoDbContext context;

        public HomeController(IMapper mapper, IUnitOfWork unitOfWork, IToDoRepository repository, ToDoDbContext context)
        {
            this.unitOfWork = unitOfWork;
            this.repository = repository;
            this.context = context;
            this.mapper = mapper;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateToDo([FromBody] SaveToDoResource todoResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var todo = mapper.Map<SaveToDoResource, ToDo>(todoResource);

            repository.Add(todo);
            await unitOfWork.CompleteAsync();

            todo = await repository.GetToDo(todo.Id);

            var result = mapper.Map<ToDo, ToDoResource>(todo);

            return Ok(result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateToDo(int id, [FromBody] SaveToDoResource todoResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var todo = await repository.GetToDo(id);

            if (todo == null)
                return NotFound();

            mapper.Map<SaveToDoResource, ToDo>(todoResource, todo);

            await unitOfWork.CompleteAsync();

            todo = await repository.GetToDo(todo.Id);
            var result = mapper.Map<ToDo, ToDoResource>(todo);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteToDo(int id)
        {
            var todo = await repository.GetToDo(id, includeRelated: false);

            if (todo == null)
                return NotFound();

            repository.Remove(todo);
            await unitOfWork.CompleteAsync();

            return Ok(id);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetToDo(int id)
        {
            var todo = await repository.GetToDo(id);

            if (todo == null)
                return NotFound();

            var todoResource = mapper.Map<ToDo, ToDoResource>(todo);

            return Ok(todoResource);
        }

        [Authorize]
        [HttpGet]
        [Route("getall")]
        public async Task<QueryResultResource<ToDoResource>> GetToDos(ToDoQueryResource filterResource)
        {
            var filter = mapper.Map<ToDoQueryResource, ToDoQuery>(filterResource);
            var queryResult = await repository.GetToDos(filter);

            return mapper.Map<QueryResult<ToDo>, QueryResultResource<ToDoResource>>(queryResult);
        }

        [Authorize]
        [HttpGet]
        [Route("getpriorities")]
        public async Task<IEnumerable<PriorityResource>> GetPriorities()
        {
            var p = await context.Priorities.ToListAsync();

            return mapper.Map<List<Priority>, List<PriorityResource>>(p);
        }
    }
}