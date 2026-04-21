using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using RamScam.backend.BusinessLogic.Interfaces;
using RamScam.backend.BusinessLogic.Models.DTOs;

namespace RamScam.backend.BusinessLogic.Services
{
    public class N8nService : IN8nService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public N8nService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> GetFunFactAsync()
        {
            // Adresi appsettings.json dosyasından okuyoruz
            string? url = _configuration["N8nSettings:WebhookUrl"];

            if (string.IsNullOrEmpty(url))
            {
                return "Sistem ayarlarında n8n adresi bulunamadı!";
            }

            
            HttpResponseMessage response = await _httpClient.PostAsync(url, null);

            if (response.IsSuccessStatusCode)
            {
                string jsonString = await response.Content.ReadAsStringAsync();

                try 
                {
                    FunFactResponse? result = JsonSerializer.Deserialize<FunFactResponse>(jsonString, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (result != null && !string.IsNullOrWhiteSpace(result.Fact))
                    {
                        return result.Fact;
                    }
                }
                catch (JsonException)
                {
                    // JSON'a çeviremezse C#'ın çökmesini engelle 
                }

                // Ekrana {{ { "Fact": "..." } }} gibi süslü metin geliyorsa dahi bozmadan döndür
                if (!string.IsNullOrWhiteSpace(jsonString))
                {
                    return jsonString;
                }

                return "Şu an şans melekleri meşgul, bilgi alınamadı!";
            }

            return $"Sunucuya ulaşılamadı. Hata Kodu: {(int)response.StatusCode}";
        }
    }
}