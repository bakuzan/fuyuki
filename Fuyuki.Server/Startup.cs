using System;
using AutoMapper;
using Fuyuki.Data;
using Fuyuki.Managers;
using Fuyuki.Mapping;
using Fuyuki.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Fuyuki
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Db
            var dbConnectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<DatabaseContext>(opts => opts.UseSqlite(dbConnectionString));

            // Identity stuff
            services.AddDefaultIdentity<ApplicationUser>()
                    .AddEntityFrameworkStores<DatabaseContext>();

            services.AddIdentityServer()
                    .AddApiAuthorization<ApplicationUser, DatabaseContext>();

            services.AddAuthentication(opts =>
                {
                    opts.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                })
                .AddReddit(opts =>
                {
                    opts.ClientId = Configuration["RedditClientID"];
                    opts.ClientSecret = Configuration["RedditClientSecret"];
                    opts.Scope.Add("identity");
                    opts.Scope.Add("read");
                    opts.Scope.Add("privatemessages");
                    opts.SaveTokens = true;
                })
                .AddIdentityServerJwt();

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 9;
                options.Password.RequiredUniqueChars = 2;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(60);
                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = false;
            });

            services.AddControllersWithViews();
            services.AddRazorPages();
            services.Configure<RazorViewEngineOptions>(o => o.ViewLocationExpanders.Add(new FuyukiViewLocationExpander()));

            // Services
            services.AddSingleton<IConfiguration>(Configuration);
            services.AddScoped<IUserService, UserService>()
                    .AddScoped<IGroupService, GroupService>()
                    .AddScoped<IGroupDataService, GroupDataService>()
                    .AddScoped<ISubredditService, SubredditService>()
                    .AddScoped<ISubredditDataService, SubredditDataService>()
                    .AddScoped<IRedditService, RedditService>()
                    .AddScoped<IRedditManager, RedditManager>();

            services.AddHttpClient<IContentService, ContentService>();

            // Mapping
            var mapping = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new UserProfile());
                mc.AddProfile(new GroupProfile());
                mc.AddProfile(new SubredditProfile());
                mc.AddProfile(new RedditProfile());
            });

            IMapper mapper = mapping.CreateMapper();
            services.AddSingleton(mapper);

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "Fuyuki.Client/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");

                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "Fuyuki.Client";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
