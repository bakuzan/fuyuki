using Microsoft.AspNetCore.Hosting;

[assembly: HostingStartup(typeof(Fuyuki.Areas.Identity.IdentityHostingStartup))]
namespace Fuyuki.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) =>
            {
            });
        }
    }
}