namespace Booking.Api.Model;

using System.ComponentModel.DataAnnotations;

public class CreateRoomRequest
{
    [Required(ErrorMessage = "Name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Room name must be between 2 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Capacity is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Capacity must be a positive integer")]
    public int Capacity { get; set; }

    [Required(ErrorMessage = "Price is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Price must be a positive integer")]
    public decimal PricePerNight { get; set; }
}