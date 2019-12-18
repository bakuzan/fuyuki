using AutoMapper;
using Fuyuki.ViewModels;

namespace Fuyuki.Mapping
{
    public class RedditProfile : Profile
    {
        public RedditProfile()
        {
            CreateMap<RedditSharp.Things.Post, RedditPost>();

        }
    }
}