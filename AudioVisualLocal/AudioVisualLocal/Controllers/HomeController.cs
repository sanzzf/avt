using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;

namespace AudioVisualLocal.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {


            if (User.Identity.IsAuthenticated)
            {
                WindowsIdentity identity = WindowsIdentity.GetCurrent();
                //IdentityReferenceCollection userGroups = identity.Groups;
                /*foreach (IdentityReference group in userGroups)
                {
                    IdentityReference translated = group.Translate(typeof(NTAccount));
                }*/
                var principal = new WindowsPrincipal(identity);
                bool isInDomainGroup = principal.IsInRole("DOMAIN USERS");
                bool isInAudioVisualGroup = principal.IsInRole("1Audio Visual");
                if (isInAudioVisualGroup)
                    return View();
                if (isInDomainGroup)
                    return RedirectToAction("Event", "Internal");
                    //return RedirectToAction("Index", "Event");
            }
            else
            {

                //return View("AudioVisualFormApplication.Controllers.HomeController", "Index");
                return Redirect("http://localhost:56829/");
            }
            //return Redirect("http://localhost:56829/");
            //return RedirectToAction("Index", "Event");
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}