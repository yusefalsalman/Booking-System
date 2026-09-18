using Booking.Api.Model;

namespace Booking.Api.Services;

public interface IAIService
{
    Task<AIRecommendationResponse> GetRoomRecommendationAsync(string userPrompt);
}