using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AudioVisualLocal.Areas.Internal.Controllers
{
    public class FilesController : Controller
    {
        // GET: Internal/Files
        public ActionResult Index()
        {
            return View();
        }
    }
}