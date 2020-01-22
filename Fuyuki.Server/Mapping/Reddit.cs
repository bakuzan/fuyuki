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

            CreateMap<Reddit.Things.Comment, Reddit.Controllers.Structures.Awards>()
                .ConvertUsing(new AwardsConverter());

            CreateMap<Reddit.Things.Comment, RedditComment>()
                .ForMember(x => x.Created, opts => opts.MapFrom(x => x.CreatedUTC))
                .ForMember(x => x.Awards, opts => opts.MapFrom(x => x))
                .ForMember(x => x.Fullname, opts => opts.MapFrom(x => x.Name))
                .ForMember(x => x.ParentFullname, opts => opts.MapFrom(x => x.ParentId))
                .ForMember(x => x.Replies, opts => opts.MapFrom(x => x.Replies.Comments))
                .ForMember(x => x.More, opts => opts.MapFrom(x => x.Replies.MoreData));

            CreateMap<Reddit.Controllers.Subreddit, RedditSubreddit>();
        }
    }
}