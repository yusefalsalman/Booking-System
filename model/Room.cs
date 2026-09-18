namespace Booking.Api.Model;

public class Room
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }

    public decimal PricePerNight { get; set; }

    // Navigation Property: One Room has Many Bookings
    public List<Booking> Bookings { get; set; } = [];
}