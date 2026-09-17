namespace Booking.Api.Model;

public class BookingResponse
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string RoomName { get; set; } = string.Empty;
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public decimal TotalPrice { get; set; }
    public int RoomId { get; set; }
}