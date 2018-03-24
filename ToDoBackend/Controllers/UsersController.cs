using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ToDoBackend.Controllers.Resources;
using ToDoBackend.Core;

namespace ToDoBackend.Controllers
{
    [Produces("application/json")]
    [Route("api/Users")]
    public class UsersController : Controller
    {
        private readonly IConfiguration config;
        private readonly IUserService userService;

        public UsersController(IConfiguration config, IUserService userService)
        {
            this.config = config;
            this.userService = userService;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public object Logowanie([FromBody] LoginResource login)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    if (userService.CheckPassword(login))
                    {
                        var claims = new[]
                        {
                          new Claim(JwtRegisteredClaimNames.Sub, login.Login),
                          new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                        };

                        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Logging:Tokens:Key"]));
                        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                        var token = new JwtSecurityToken(config["Logging:Tokens:Issuer"],
                              config["Logging:Tokens:Issuer"],
                              claims,
                              expires: DateTime.Now.AddYears(1),
                              signingCredentials: creds);

                        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
                    }
                }
                catch (Exception exc)
                {
                    return BadRequest(exc.Message);
                }
            }

            return BadRequest("Niepoprawny login lub hasło");
        }

    }
}