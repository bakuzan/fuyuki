using System.Net.Http;
using System.Threading.Tasks;
using Fuyuki.ViewModels;

namespace Fuyuki.Services
{
    public class ContentService : IContentService
    {

        private readonly HttpClient _httpClient;

        public ContentService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ContentResponse> GetGfycatInfo(string contentId)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.gfycat.com/v1/gfycats/{contentId}");
            var response = await _httpClient.SendAsync(request);

            return await ProcessResponse(response);
        }

        public async Task<ContentResponse> GetVReddit(string contentId)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"https://v.redd.it/{contentId}/DASHPlaylist.mpd");
            var response = await _httpClient.SendAsync(request);

            return await ProcessResponse(response);
        }

        private async Task<ContentResponse> ProcessResponse(HttpResponseMessage response)
        {
            var result = new ContentResponse();

            if (response.IsSuccessStatusCode)
            {
                result.Content = await response.Content.ReadAsStringAsync();
            }
            else
            {
                result.ErrorMessages.Add($"StatusCode: {response.StatusCode}");
            }

            return result;
        }

    }
}
