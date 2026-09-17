namespace Booking.Api.Model;

public class Booking
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public decimal TotalPrice { get; set; }

    // Foreign Key
    public int RoomId { get; set; }

    // Navigation Property: Reference to the parent Room
    public Room Room { get; set; } = null!;
}