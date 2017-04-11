using AudioVisualModule.DAL;
using System;
using PagedList;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AudioVisualLocal.Areas.Internal.Controllers
{
    public class EventController : Controller
    {
        private AudioVisualDataContext db = new AudioVisualDataContext();
        // GET: Internal/Event
        public ActionResult Index(string sortOrder, string currentFilter, string searchString, int? page)
        {
            ViewBag.NameSortParm = String.IsNullOrEmpty(sortOrder) ? "name_desc" : "";
            ViewBag.DescriptionSortParm = sortOrder == "Description" ? "desc_desc" : "Description";
            ViewBag.StartDateSortParm = sortOrder == "StartDate" ? "startdate_desc" : "StartDate";
            ViewBag.EndDateSortParm = sortOrder == "EndDate" ? "enddate_desc" : "EndDate";
            if (searchString != null)
            {

                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }
            ViewBag.CurrentFilter = searchString;
            var _events = db.Event.AsQueryable();
            if (!String.IsNullOrWhiteSpace(searchString))
            {
                _events = _events.Where(d => d.Name.Contains(searchString) ||
                d.Description.Contains(searchString));

            }
            switch (sortOrder)
            {
                case "name_desc":
                    _events = _events.OrderByDescending(s => s.Name);
                    break;
                case "desc_desc":
                    _events = _events.OrderByDescending(s => s.Description);
                    break;
                case "startdate_desc":
                    _events = _events.OrderByDescending(s => s.StartDate);
                    break;
                case "StartDate":
                    _events = _events.OrderBy(s => s.StartDate);
                    break;
                case "enddate_desc":
                    _events = _events.OrderByDescending(s => s.EndDate);
                    break;
                case "EndDate":
                    _events = _events.OrderBy(s => s.EndDate);
                    break;
                default:
                    _events = _events.OrderBy(s => s.Name);
                    break;
            }
            int pageSize = 10;
            int pageNumber = (page ?? 1);
            return View(_events.ToPagedList(pageNumber, pageSize));
        }
    }
}