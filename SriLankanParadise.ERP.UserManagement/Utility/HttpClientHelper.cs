namespace SriLankanParadise.ERP.UserManagement.Utility
{

    public interface IHttpClientHelper
    {
        Task<HttpResponseMessage> GetAsync(string requestUri);
        Task<HttpResponseMessage> PostAsJsonAsync<T>(string requestUri, T content);
        Task<T> ReadFromJsonAsync<T>(HttpResponseMessage responseMessage);
    }

    public class HttpClientHelper : IHttpClientHelper
    {
        private readonly IHttpClientFactory _clientFactory;

        public HttpClientHelper(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        private HttpClient CreateClient()
        {
            return _clientFactory.CreateClient("AyuOMSClient");
        }

        public Task<HttpResponseMessage> GetAsync(string requestUri)
        {
            var client = CreateClient();
            return client.GetAsync(requestUri);
        }

        public async Task<HttpResponseMessage> PostAsJsonAsync<T>(string requestUri, T content)
        {
            var client = CreateClient();
            return await client.PostAsJsonAsync(requestUri, content);
        }

        public async Task<T?> ReadFromJsonAsync<T>(HttpResponseMessage responseMessage)
        {
            return await responseMessage.Content.ReadFromJsonAsync<T>();
        }
    }
}
