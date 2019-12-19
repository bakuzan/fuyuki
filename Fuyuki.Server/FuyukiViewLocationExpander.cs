using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Razor;

namespace Fuyuki
{
    public class FuyukiViewLocationExpander : IViewLocationExpander
    {

        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context,
            IEnumerable<string> viewLocations)
        {
            // Replace the Views to MyViews..  
            viewLocations = viewLocations.Select(s => s.Replace("Views", "Fuyuki.Server/Pages"));

            return viewLocations;
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        { }
    }
}
