using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoBackend.Controllers.Resources;

namespace ToDoBackend.Core
{
    public interface IUserService
    {
        bool CheckPassword(LoginResource login);
    }
}
