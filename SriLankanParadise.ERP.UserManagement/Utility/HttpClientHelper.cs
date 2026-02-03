namespace SriLankanParadise.ERP.UserManagement.Utility
{

    public interface IHttpClientHelper
    {
        Task<HttpResponseMessage> GetAsync(string requestUri);
        Task<HttpResponseMessage> PostAsJsonAsync<T>(string requestUri, T content);
        Task<T> ReadFromJsonAsync<T>(HttpResponseMessage responseMessage);
        Task<string> GetStringAsync(string requestUri);
    }

    public class HttpClientHelper : IHttpClientHelper
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly ILogger<HttpClientHelper> _logger;

        public HttpClientHelper(IHttpClientFactory clientFactory, ILogger<HttpClientHelper> logger)
        {
            _clientFactory = clientFactory;
            _logger = logger;
        }

        private HttpClient CreateClient()
        {
            return _clientFactory.CreateClient("AyuOMSClient");
        }

        public async Task<HttpResponseMessage> GetAsync(string requestUri)
        {
            var client = CreateClient();
            return await client.GetAsync(requestUri);
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

        public async Task<string> GetStringAsync(string requestUri)
        {
            var client = CreateClient();
            try
            {
                using var response = await client.GetAsync(requestUri);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStringAsync();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request failed for URI: {RequestUri}", requestUri);
                throw;
            }
        }
    }
}
