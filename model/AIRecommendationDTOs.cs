namespace Booking.Api.Model;

public class AIRecommendationRequest
{
    public string Prompt { get; set; } = string.Empty;
}

public class AIRecommendationResponse
{
    public int? RecommendedRoomId { get; set; }
    public string RoomName { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
}