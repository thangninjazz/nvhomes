using Microsoft.Extensions.Configuration;
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

        public ReCaptchaService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }

        public async Task<bool> VerifyToken(string token)
        {
            var secretKey = _configuration["ReCaptcha:SecretKey"];
            if (string.IsNullOrEmpty(secretKey)) return true; // Skip validation if not configured

            var response = await _httpClient.PostAsync(
                $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}", 
                null);

            if (!response.IsSuccessStatusCode) return false;

            var jsonString = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ReCaptchaResponse>(jsonString);

            return result?.Success ?? false;
        }

        private class ReCaptchaResponse
        {
            public bool Success { get; set; }
            public float Score { get; set; } // For v3
        }
    }
}
