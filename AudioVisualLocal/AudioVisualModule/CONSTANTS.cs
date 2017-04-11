using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AudioVisualModule
{
    public class CONSTANTS
    {
        public static class AZURE
        {
            public static string ACCOUNT_NAME = ConfigurationManager.AppSettings["Azure.AccountName"];
            public static string ACCOUNT_KEY = ConfigurationManager.AppSettings["Azure.AccountKey"];
            public static string CONTAINER = ConfigurationManager.AppSettings["Azure.Container"];
            public static string CONTAINER_URL = ConfigurationManager.AppSettings["Azure.ContainerUrl"];
        }
    }
}
