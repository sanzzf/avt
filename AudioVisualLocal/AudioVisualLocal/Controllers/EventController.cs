using AudioVisualModule.DAL;
using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AudioVisualModule.Models;
using System.Collections;
using AudioVisualModule;
using Microsoft.AspNet.Identity.Owin;
using System.Net;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;

namespace AudioVisualLocal.Controllers
{
    public class EventController : Controller
    {
        private AudioVisualDataContext db = new AudioVisualDataContext();
        public static string createSuccessMessage = "Event created successfully.";
        public static string createFailedMessage = "Event cannot be created. Please check if you are entering correct information.";
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public EventController()
        {

        }
        public EventController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }
        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        // GET: Event
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
        public ActionResult Upload()
        {

            int selectedId = 1;

            ViewBag.Events = new SelectList(db.Event, "id", "Email", selectedId);
            return View();
        }

        public ActionResult Create()
        {

            //int selectedId = 1;
            
            //ViewBag.ApplicationUser = new SelectList(db.Users,"id","Email",selectedId);
            
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async System.Threading.Tasks.Task<ActionResult> Create(Event _event, string firstname, string lastname, string organisation)
        {
            var count = db.Users.Count(u => u.Email == _event.UserEmail);
            //_event.UserId = Request.Form["dropdownUser"].ToString();
            if (count == 0)
            { 
                //if new user, create a user in aspnetuser table
                RegisterViewModel _model = new RegisterViewModel();
                _model.Email = _event.UserEmail;
                _model.Password = Guid.NewGuid().ToString()+"A";
                _model.FirstName = firstname;
                _model.LastName = lastname;
                _model.Organisation = organisation;
                var user = new ApplicationUser { UserName = _model.Email, Email = _model.Email, FirstName= _model.FirstName, LastName= _model.LastName, Organisation= _model.Organisation};
                //var password = Guid.NewGuid().ToString();
                var result = await UserManager.CreateAsync(user, _model.Password );
                if (result.Succeeded)
                {
                    //string confirmcode = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                    //await UserManager.ConfirmEmailAsync(user.Id, confirmcode);
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);
                    var errors = ModelState.Values.SelectMany(v => v.Errors);
                    if (ModelState.IsValid)
                    {
                        _event.Name = _event.Name + "-" + _model.Organisation + "-" + _event.StartDate;
                        db.Event.Add(_event);
                        db.SaveChanges();
                        //var storageAccount = CloudStorageAccount.Parse(string.Format(AZURE_CONNECTION_STRING, CONSTANTS.AZURE.ACCOUNT_NAME, CONSTANTS.AZURE.ACCOUNT_KEY));
                        /*StorageCredentials creds = new StorageCredentials(CONSTANTS.AZURE.ACCOUNT_NAME, CONSTANTS.AZURE.ACCOUNT_KEY);

                        CloudStorageAccount account = new CloudStorageAccount(creds, useHttps: true);
                        CloudBlobClient blobClient = account.CreateCloudBlobClient();
                        CloudBlobContainer container = blobClient.GetContainerReference(CONSTANTS.AZURE.CONTAINER);
                        container.CreateIfNotExists();
                        
                        container.SetPermissions(
                            new BlobContainerPermissions
                            {
                                PublicAccess = BlobContainerPublicAccessType.Container
                            });
                            */
                        TempData["Success"] = createSuccessMessage;
                        return RedirectToAction("Index");
                    }
                }
            }
            else
            {
                if (ModelState.IsValid)
                {
                    db.Event.Add(_event);
                    db.SaveChanges();
                    TempData["Success"] = createSuccessMessage;
                    return RedirectToAction("Index");
                }
            }

           
            // If we got this far, something failed, redisplay form
            TempData["Failed"] = createFailedMessage;
            return RedirectToAction("Create");
        }

        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Event _event = db.Event.Find(id);
            if (_event == null)
            {
                return HttpNotFound();
            }
            return View();
        }

        // POST: Event/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Event _event = db.Event.Find(id);
            Files _files = db.Files.Find(id);
            db.Event.Remove(_event);
            db.Files.Remove(_files);
            db.SaveChanges();
            return RedirectToAction("Index");
        }


    }
}