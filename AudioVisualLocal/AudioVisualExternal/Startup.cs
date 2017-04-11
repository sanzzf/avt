using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AudioVisualExternal.Startup))]
namespace AudioVisualExternal
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
