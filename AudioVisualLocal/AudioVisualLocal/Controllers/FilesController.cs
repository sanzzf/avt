using AudioVisualModule.DAL;
using AudioVisualModule.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Blob; // Namespace for Blob storage types
using Microsoft.Azure;
using static System.Net.WebRequestMethods;
using PagedList;
using AudioVisualModule;
using System.IO;


namespace AudioVisualLocal.Controllers
{
    public class FilesController : Controller
    {
        private AudioVisualDataContext db = new AudioVisualDataContext();
        public static string uploadSuccessMessage = "File uploaded successfully.";
        public static string uploadFailedMessage = "File cannot be uploaded.";
        public static string downloadSuccessMessage = "File downloaded successfully.";
        public static string downloadFailedMessage = "File cannot be downloaded.";
        // GET: Files
        public ActionResult Index(int? id, string sortOrder, string currentFilter, string searchString, int? page)
        {
            //int selectedId = 1;
            //ViewBag.dropdownEvent = new SelectList(db.Event, "id", "Name", selectedId);
            ViewBag.FileNameSortParm = String.IsNullOrEmpty(sortOrder) ? "name_desc" : "";
            ViewBag.FilePathSortParm = sortOrder == "Description" ? "path_desc" : "FilePath";
            //ViewBag.DateCreatedSortParm = sortOrder == "StartDate" ? "startdate_desc" : "StartDate";
            //ViewBag.EventAssociatedSortParm = sortOrder == "EndDate" ? "enddate_desc" : "EndDate";
            if (searchString != null)
            {

                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }
            ViewBag.CurrentFilter = searchString;
            var eventName = db.Event.Find(id).Name;
            var files = db.Files.Where(a => a.EventId == id.ToString());
            if (!String.IsNullOrWhiteSpace(searchString))
            {
                files = files.Where(d => d.FileName.Contains(searchString) ||
                d.FilePath.Contains(searchString));

            }
            switch (sortOrder)
            {
                case "name_desc":
                    files = files.OrderByDescending(s => s.FileName);
                    break;
                case "path_desc":
                    files = files.OrderByDescending(s => s.FilePath);
                    break;
                default:
                    files = files.OrderBy(s => s.FileName);
                    break;
            }
            int pageSize = 10;
            int pageNumber = (page ?? 1);
            
            return View(files.ToPagedList(pageNumber, pageSize));
            
        }


        public ActionResult Upload(int? id)
        {
            /*int selectedId = 1;
            ViewBag.dropdownEvent = new SelectList(db.Event, "id", "Name", selectedId);
            return View();*/
            //var eventName = db.Event.Find(id).Name;
            //var files = db.Files.Where(a => a.EventId == id.ToString());
            ViewBag.EventId = id;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Upload(HttpPostedFileBase file, Files _files, int? id)
        {
            var eventName = db.Event.Find(id).Name;
            var eventStartDate = db.Event.Find(id).StartDate;
            //CloudStorageAccount storageAccount = CloudStorageAccount.Parse(string.Format(AZURE_CONNECTION_STRING, CONSTANTS.AZURE.ACCOUNT_NAME, CONSTANTS.AZURE.ACCOUNT_KEY));
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString"));
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            // Create the container if it doesn't already exist.
            CloudBlobContainer container = blobClient.GetContainerReference(CONSTANTS.AZURE.CONTAINER);
            // Retrieve reference to a blob named "myblob".
            
            container.CreateIfNotExists();
            var blobPath = eventName + "-" + eventStartDate.ToString("dd-MM-yyyy")+"/"+file.FileName;
            // Create or overwrite the "myblob" blob with contents from a local file.

            CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobPath);
            using (var fileStream = file.InputStream)
            {
               blockBlob.UploadFromStream(fileStream);
            }
            var errors = ModelState.Values.SelectMany(v => v.Errors);
            if (ModelState.IsValid)
            {
                _files.FileName = file.FileName;
                _files.FilePath = eventName + "-" + eventStartDate.ToString("dd-MM-yyyy");
                _files.EventId = id.ToString();
                _files.DateCreated = DateTime.Now;
                db.Files.Add(_files);
                db.SaveChanges();
                TempData["Success"] = uploadSuccessMessage;
                //return RedirectToAction("Index");
                return View();
            }
            TempData["Failed"] = uploadFailedMessage;
            return View();
        }
        public void Download(int? id, string filename, string filepath)
        {
            var eventName = db.Event.Find(id).Name;
            var eventStartDate = db.Event.Find(id).StartDate;
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString"));
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference(CONSTANTS.AZURE.CONTAINER);
            var uri= blobClient.StorageUri;
            var blobPath = filepath+"/"+filename;
            CloudBlockBlob blob = container.GetBlockBlobReference(blobPath);
            MemoryStream memStream = new MemoryStream();
            memStream.Seek(0, SeekOrigin.Begin);
            blob.DownloadToStream(memStream);
            
            Response.ContentType = blob.Properties.ContentType;
            Response.AddHeader("Content-Disposition", "Attachment; filename=\"" + filename + "\"");
            Response.AddHeader("Content-Length", blob.Properties.Length.ToString());
            Response.BinaryWrite(memStream.ToArray());

            /*foreach (var item in ListBlobs)
            {
                string name = ((CloudBlockBlob)item).Name;
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobPath);
                
                blockBlob.DownloadToFile(@"D:\Downloads", FileMode.OpenOrCreate);
                /*using (var fileStream = System.IO.File.OpenWrite(@"D:\Downloads\"+filename))
                {
                    blockBlob.DownloadToStream(fileStream);
                }*/
            //}

            TempData["Success"] = downloadSuccessMessage;
        }

        public void DownloadAll(int? id)
        {
            var eventName = db.Event.Find(id).Name;
            var eventStartDate = db.Event.Find(id).StartDate;
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString"));
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            CloudBlobContainer container = blobClient.GetContainerReference(CONSTANTS.AZURE.CONTAINER);
            
            var uri = blobClient.StorageUri;

            IEnumerable<IListBlobItem> ListBlobs = container.ListBlobs(string.Empty, true);

            /*foreach (var item in ListBlobs)
            {
                
                string name = ((CloudBlockBlob)item).Name;
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(name);
                string path = (@"C:\Users\Public\Downloads\" + name);
                blockBlob.DownloadToFile(path, FileMode.OpenOrCreate);
            }*/
            CloudBlobDirectory blobDirectory = container.GetDirectoryReference("another event-31-03-2017");
            var blob = blobDirectory.ListBlobs().ToList();
            //OutputBlobDirectoryAsZipDownload(blobDirectory, blobClient);
                /*
            foreach (CloudBlob b in blob)
            {

                
                string path = Path.GetTempPath();
                path = path + "/azuretemp";
                Directory.CreateDirectory(path);
                path = path + "/" + Path.GetFileName(b.Name);
                b.DownloadToFile(path, FileMode.OpenOrCreate);

            }
            */
        }

       /* private void OutputBlobDirectoryAsZipDownload(CloudBlobDirectory directory, CloudBlobClient blobClient)
        {
            
            var allFiles = directory.ListBlobs(true, BlobListingDetails.None, null, null).Where(x => x.GetType() == typeof(CloudBlockBlob)).Cast<CloudBlob>();
            string xyzblob = directory.Uri.ToString().TrimEnd('/');
            var dBlob = blobClient.GetBlobReferenceFromServer(directory.Uri, null,null,null);
            
            byte[] fileBytes = null;
            //fileBytes = dBlob.DownloadByteArray();
            dBlob.DownloadToByteArray(fileBytes, 0, null, null, null);
            ZipOutputStream zipOutputStream = new ZipOutputStream(Response.OutputStream);
            foreach (var file in allFiles)
            {
                using (var fileStream = new MemoryStream(fileBytes))
                {
                    var entryName = file.Uri.ToString().Replace(directory.Uri.ToString(), "");
                    zipOutputStream.PutNextEntry(entryName);
                    fileStream.Seek(0, SeekOrigin.Begin);
                    int count = fileStream.Read(fileBytes, 0, fileBytes.Length);
                    while (count > 0)
                    {
                        zipOutputStream.Write(fileBytes, 0, count);

                        count = fileStream.Read(fileBytes, 0, fileBytes.Length);
                        if (!Response.IsClientConnected)
                        {
                            break;
                        }
                        Response.Flush();
                    }
                    fileStream.Close();
                }
            }
            zipOutputStream.Close();
        }*/
    }
}