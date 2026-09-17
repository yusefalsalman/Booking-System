namespace Booking.Api.Model;

using System.ComponentModel.DataAnnotations;


public class CreateBookingRequest
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Room ID must be a positive integer.")]
    public int RoomId { get; set; }
    [Required]
    public DateTime CheckInDate { get; set; }
    [Required]
    public DateTime CheckOutDate { get; set; }
}

