using AutoMapper;
using Fuyuki.ViewModels;

namespace Fuyuki.Mapping
{
    public class RedditProfile : Profile
    {
        public RedditProfile()
        {
            CreateMap<Reddit.Controllers.Post, RedditPost>()
                .ForMember(x => x.Created, opts => opts.MapFrom(x => x.Listing.CreatedUTC))
                .ForMember(x => x.Edited, opts => opts.MapFrom(x => x.Listing.Edited))
                .ForMember(x => x.IsSelf, opts => opts.MapFrom(x => x.Listing.IsSelf))
                .ForMember(x => x.IsVideo, opts => opts.MapFrom(x => x.Listing.IsVideo))
                .ForMember(x => x.NumberOfComments, opts => opts.MapFrom(x => x.Listing.NumComments))
                .ForMember(x => x.TextBody, opts => opts.MapFrom(x => x.Listing.SelfTextHTML))
                .ForMember(x => x.Thumbnail, opts => opts.MapFrom(x => x.Listing.Thumbnail))
                .ForMember(x => x.URL, opts => opts.MapFrom(x => x.Listing.URL));

        }
    }
}