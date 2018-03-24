using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ToDoBackend.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AutoMapper;
using ToDoBackend.Core;

namespace ToDoBackend
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<IToDoRepository, ToDoRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddTransient<IUserService, UserService>();

            services.AddAutoMapper();

            services.AddDbContext<ToDoDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("Default"), b => b.UseRowNumberForPaging()));

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builders =>
                    {
                        builders
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                    });
            });

            services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
              .AddJwtBearer(options =>
              {
                  options.RequireHttpsMetadata = false;
                  options.SaveToken = true;
                  options.TokenValidationParameters = new TokenValidationParameters
                  {
                      ValidateIssuer = true,
                      ValidateAudience = true,
                      ValidateLifetime = true,
                      ValidateIssuerSigningKey = true,
                      ValidIssuer = "localhost:56341",
                      ValidAudience = "localhost:56341",
                      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Qv9ZrreAhwfgjn9m"))
                  };
                      // options.Audience = "localhost:44313/";
                      // options.Authority = "localhost:44313/";
              });

            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("AllowAll");

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseMvc();
        }
    }
}
