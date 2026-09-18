using System.Net.Http.Json;
using System.Text.Json;
using Booking.Api.Data;
using Booking.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace Booking.Api.Services;

public class GeminiService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly BookingDbContext _context;
    private readonly string _apiKey;
    private readonly string _model;

    public GeminiService(HttpClient httpClient, BookingDbContext context, IConfiguration config)
    {
        _httpClient = httpClient;
        _context = context;
        _apiKey = config["Gemini:ApiKey"] ?? throw new ArgumentNullException(nameof(config), "Gemini:ApiKey is missing.");
        _model = config["Gemini:Model"] ?? "gemini-1.5-flash";
    }

    public async Task<AIRecommendationResponse> GetRoomRecommendationAsync(string userPrompt)
    {
        var rooms = await _context.Rooms
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Capacity,
                r.PricePerNight
            })
            .ToListAsync();

        var roomCatalogJson = JsonSerializer.Serialize(rooms);

        var systemInstruction = $@"
You are an expert luxury hotel booking concierge.
Select the single most suitable room for the user from the available rooms catalog below:

AVAILABLE ROOMS:
{roomCatalogJson}

RULES:
1. Recommend the best matching RoomId according to capacity, budget, and description.
2. Return ONLY a valid JSON object matching this schema:
{{
  ""RecommendedRoomId"": number,
  ""RoomName"": ""string"",
  ""Explanation"": ""concise explanation in the user's language"",
  ""PricePerNight"": number
}}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = systemInstruction },
                        new { text = $"User Request: {userPrompt}" }
                    }
                }
            },
            generationConfig = new
            {
                response_mime_type = "application/json"
            }
        };

        // استخدام v1beta هو المسار المعتمد لموديل gemini-1.5-flash
        var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";

        var response = await _httpClient.PostAsJsonAsync(endpoint, requestBody);

        if (!response.IsSuccessStatusCode)
        {
            var err = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Gemini API error: {response.StatusCode} - {err}");
        }

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);

        var rawText = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        return JsonSerializer.Deserialize<AIRecommendationResponse>(rawText!, options)
               ?? new AIRecommendationResponse { Explanation = "Could not parse recommendation." };
    }
}