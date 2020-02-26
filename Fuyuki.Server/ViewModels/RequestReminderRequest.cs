using Fuyuki.Enums;

namespace Fuyuki.ViewModels
{
    public class RequestReminderRequest
    {
        public string Location { get; set; }
        public string Message { get; set; }
        public int Duration { get; set; }
        public TimePeriod Period { get; set; }
    }
}
