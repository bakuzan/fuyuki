using AutoMapper;
using Fuyuki.ViewModels;

namespace Fuyuki.Mapping
{
    public class RedditProfile : Profile
    {
        public RedditProfile()
        {
            CreateMap<Reddit.Controllers.User, RedditUser>();

            CreateMap<Reddit.Controllers.Post, RedditPost>()
                .ForMember(x => x.Created, opts => opts.MapFrom(x => x.Listing.CreatedUTC))
                .ForMember(x => x.Edited, opts => opts.MapFrom(x => x.Listing.Edited))
                .ForMember(x => x.IsSelf, opts => opts.MapFrom(x => x.Listing.IsSelf))
                .ForMember(x => x.IsVideo, opts => opts.MapFrom(x => x.Listing.IsVideo))
                .ForMember(x => x.NumberOfComments, opts => opts.MapFrom(x => x.Listing.NumComments))
                .ForMember(x => x.TextBody, opts => opts.MapFrom(x => x.Listing.SelfTextHTML))
                .ForMember(x => x.Thumbnail, opts => opts.MapFrom(x => x.Listing.Thumbnail))
                .ForMember(x => x.URL, opts => opts.MapFrom(x => x.Listing.URL))
                .ForMember(x => x.LinkFlairText, opts => opts.MapFrom(x => x.Listing.LinkFlairText))
                .ForMember(x => x.LinkFlairType, opts => opts.MapFrom(x => x.Listing.LinkFlairType))
                .ForMember(x => x.AuthorFlairText, opts => opts.MapFrom(x => x.Listing.AuthorFlairText))
                .ForMember(x => x.AuthorFlairType, opts => opts.MapFrom(x => x.Listing.AuthorFlairType))
                .ForMember(x => x.Stickied, opts => opts.MapFrom(x => x.Listing.Stickied));

            CreateMap<Reddit.Controllers.Comment, RedditComment>()
                .ForMember(x => x.Created, opts => opts.MapFrom(x => x.Listing.CreatedUTC))
                .ForMember(x => x.Edited, opts => opts.MapFrom(x => x.Listing.Edited))
                .ForMember(x => x.AuthorFlairText, opts => opts.MapFrom(x => x.Listing.AuthorFlairText))
                .ForMember(x => x.Distinguished, opts => opts.MapFrom(x => x.Listing.Distinguished))
                .ForMember(x => x.Stickied, opts => opts.MapFrom(x => x.Listing.Stickied))
                .ForMember(x => x.Removed, opts => opts.MapFrom(x => x.Listing.Removed))
                .ForMember(x => x.Replies, opts => opts.MapFrom(x => x.Replies))
                .ForMember(x => x.More, opts => opts.MapFrom(x => x.More));

        }
    }
}