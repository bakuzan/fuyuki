using System.Linq;
using AutoMapper;
using Fuyuki.Data;
using Fuyuki.ViewModels;

namespace Fuyuki.Mapping
{
    public class GroupProfile : Profile
    {
        public GroupProfile()
        {
            CreateMap<Group, GroupModel>();

            CreateMap<Group, GroupSubsModel>()
                .ForMember(x => x.Subreddits, opts => opts.MapFrom(x => x.GroupSubreddits.Select(s => s.Subreddit)));

            CreateMap<GroupModel, Group>()
                .ForMember(x => x.Name, opts => opts.MapFrom(x => x.Name.Trim()));

            CreateMap<GroupRequest, Group>()
                .ForMember(x => x.Name, opts => opts.MapFrom(x => x.Name.Trim()));

            CreateMap<GroupDto, GroupMembershipModel>();
        }
    }
}