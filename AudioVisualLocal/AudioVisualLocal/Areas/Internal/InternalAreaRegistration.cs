﻿using System.Web.Mvc;

namespace AudioVisualLocal.Areas.Internal
{
    public class InternalAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Internal";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            /*context.MapRoute(
                "Internal_default",
                "Internal/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );*/
            context.MapRoute(
                "Internal_default",
                "Internal/{controller}/{action}/{id}",
                new { controller = "Event", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}