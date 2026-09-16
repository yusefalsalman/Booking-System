namespace Booking.Api.Model;

using System.ComponentModel.DataAnnotations;


public class CreateBookingRequest
{
    [Required(ErrorMessage = "Customer name is required.")]
    [StringLength(100, MinimumLength = 2)]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    public DateTime CheckInDate { get; set; }

    [Required]
    public DateTime CheckOutDate { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Room ID must be a positive integer.")]
    public int RoomId { get; set; }
}

