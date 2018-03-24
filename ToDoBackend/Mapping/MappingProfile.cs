using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoBackend.Controllers.Resources;
using ToDoBackend.Core.Models;

namespace ToDoBackend.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap(typeof(QueryResult<>), typeof(QueryResultResource<>));
            CreateMap<ToDoQueryResource, ToDoQuery>();
            CreateMap<Priority, PriorityResource>();

            CreateMap<ToDo, SaveToDoResource>();
            CreateMap<ToDo, ToDoResource>();

            CreateMap<SaveToDoResource, ToDo>()
              .ForMember(v => v.Id, opt => opt.Ignore());
        }
    }
}
