using System.Collections.Generic;

namespace Fuyuki.ViewModels
{
    public class MoreChildrenRequest
    {
        public string PostId { get; set; }
        public List<string> CommentIds { get; set; }
    }
}
