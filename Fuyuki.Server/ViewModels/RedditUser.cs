namespace Fuyuki.ViewModels
{
    public class RedditUser
    {
        public string Name { get; set; }
        public string Fullname { get; set; }
        public string Id { get; set; }
        public int InboxCount { get; set; }
        public bool HasNewModmail { get; set; }
        public bool HasMail { get; set; }
    }
}
