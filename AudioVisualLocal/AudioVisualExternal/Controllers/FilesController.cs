using AudioVisualModule.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AudioVisualExternal.Controllers
{
    public class FilesController : Controller
    {
        private AudioVisualDataContext db = new AudioVisualDataContext();

        // GET: Event
        public ActionResult Index()
        {

            return View();
        }
    }
}