using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace NVHome.Infrastructure.Services
{
    public interface IReCaptchaService
    {
        Task<bool> VerifyToken(string token);
    }

    public class ReCaptchaService : IReCaptchaService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly Microsoft.Extensions.Logging.ILogger<ReCaptchaService> _logger;

        public ReCaptchaService(IConfiguration configuration, HttpClient httpClient, Microsoft.Extensions.Logging.ILogger<ReCaptchaService> logger)
        {
            _configuration = configuration;
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<bool> VerifyToken(string token)
        {
            var secretKey = _configuration["ReCaptcha:SecretKey"];
            if (string.IsNullOrEmpty(secretKey)) return true; 

            var response = await _httpClient.PostAsync(
                $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}", 
                null);

            if (!response.IsSuccessStatusCode) return false;

            var jsonString = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("ReCaptcha Response: {Json}", jsonString);
            
            var result = JsonSerializer.Deserialize<ReCaptchaResponse>(jsonString);

            if (result == null || !result.Success)
            {
                _logger.LogWarning("ReCaptcha Verification Failed: {Json}", jsonString);
                return false;
            }

            // Đối với v3, nếu Score quá thấp (< 0.5) thì có thể coi là bot
            if (result.Score < 0.5f)
            {
                _logger.LogWarning("ReCaptcha Score too low: {Score}", result.Score);
                // return false; // Bạn có thể quyết định chặn hoặc cho qua tùy độ gắt
            }

            return result.Success;
        }

        private class ReCaptchaResponse
        {
            public bool Success { get; set; }
            public float Score { get; set; } // For v3
        }
    }
}
