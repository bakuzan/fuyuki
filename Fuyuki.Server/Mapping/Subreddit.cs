using AutoMapper;
using Fuyuki.Data;
using Fuyuki.ViewModels;

namespace Fuyuki.Mapping
{
    public class SubredditProfile : Profile
    {
        public SubredditProfile()
        {
            CreateMap<Subreddit, SubredditModel>();

            CreateMap<SubredditModel, Subreddit>();
        }
    }
}