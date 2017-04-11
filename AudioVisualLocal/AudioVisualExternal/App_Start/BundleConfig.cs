using System.Web;
using System.Web.Optimization;


namespace AudioVisualExternal
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            /* bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                         "~/Scripts/jquery-{version}.js"));

             bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                         "~/Scripts/jquery.validate*"));

             // Use the development version of Modernizr to develop with and learn from. Then, when you're
             // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
             bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                         "~/Scripts/modernizr-*"));

             bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                       "~/Scripts/bootstrap.js",
                       "~/Scripts/respond.js"));

             bundles.Add(new StyleBundle("~/Content/css").Include(
                       "~/Content/bootstrap.css",
                       "~/Content/site.css"));
                       */
            AddCss(bundles);
            AddJavaScript(bundles);
        }

        private static void AddCss(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle(
                "~/Content/css")
                .Include("~/Content/main.css"));

            bundles.Add(new StyleBundle("~/Content/re")
                .Include("~/Content/Redesign2015/main.css", "~/Content/Redesign2015/modular.css", "~/Content/Redesign2015/responsive.css", "~/Content/site.css"));
        }

        private static void AddJavaScript(BundleCollection bundles)
        {
            // TODO: Test fallbacks.

            var jQuery = new ScriptBundle("~/Scripts/jquery")
                .Include("~/Scripts/Libraries/jquery-2.1.3.min.js");
            jQuery.CdnFallbackExpression = "window.jQuery";
            bundles.Add(jQuery);

            var jQueryValidate = new ScriptBundle("~/Scripts/jquery-validate")
                .Include("~/Scripts/Libraries/jquery.validate-1.13.1.min.js");
            jQueryValidate.CdnFallbackExpression = "$.validator";
            bundles.Add(jQueryValidate);

            var jQueryValidateUnobstrusive = new ScriptBundle("~/Scripts/jquery-validate-unobstrusive")
                .Include("~/Scripts/Libraries/jquery.validate.unobtrusive-5.2.3.min.js");
            jQueryValidateUnobstrusive.CdnFallbackExpression = "$.validator.unobtrusive";
            bundles.Add(jQueryValidateUnobstrusive);

            bundles.Add(new ScriptBundle("~/Scripts/jquery-ui").Include(
                "~/Scripts/Libraries/jquery.ui-1.11.4.min.js"));



            bundles.Add(new ScriptBundle("~/Scripts/re").Include(
                "~/Scripts/Redesign2015/core.1.0.1.js",
                "~/Scripts/Redesign2015/interact.1.0.0.js",
                "~/Scripts/Redesign2015/cookied.1.0.0.js",
                "~/Scripts/Redesign2015/sharey.js",
                "~/Scripts/Redesign2015/imageSizes.js",
                "~/Scripts/Redesign2015/main.js",
                "~/Scripts/Redesign2015/page.js"));

            bundles.Add(new ScriptBundle("~/Scripts/re").Include(
                "~/Scripts/Custom/custom.js",
                "~/Scripts/Custom/feedback.js"));
        }
    }
}
