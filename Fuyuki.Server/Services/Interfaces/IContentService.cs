using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public interface IContentService
    {
        Task<ContentResponse> GetMetadataInfo(string permalink);
        Task<ContentResponse> GetGfycatInfo(string contentId);
        Task<ContentResponse> GetRedgifsInfo(string contentId);
        Task<ContentResponse> GetVReddit(string contentId);
    }
}
