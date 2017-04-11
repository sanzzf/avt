using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AudioVisualLocal
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new string[] { "AudioVisualLocal.Controllers" }
            );
            routes.MapRoute(
              name: "Events",
              url: "Events/{action}/{id}", // URL with parameters
              defaults: new { controller = "Events", action = "Index", id = UrlParameter.Optional }, // Parameter defaults
              namespaces: new string[] { "AudioVisualLocal.Controllers" }
            );
            routes.MapRoute(
              name: "Files",
              url: "Files/{action}/{id}", // URL with parameters
              defaults: new { controller = "Files", action = "Index", id = UrlParameter.Optional }, // Parameter defaults
              namespaces: new string[] { "AudioVisualLocal.Controllers" }
            );
        }
    }
}
