using Booking.Api.Model;

namespace Booking.Api.Services;

public interface IBookingService
{
    Task<List<BookingResponse>> GetAllBookingsAsync();
    Task<BookingResponse?> GetBookingByIdAsync(int id);
    Task<List<BookingResponse>> GetBookingsByRoomIdAsync(int roomId);
    Task<(bool Success, string? ErrorMessage, BookingResponse? Booking)> CreateBookingAsync(CreateBookingRequest request);
    Task<bool> CancelBookingAsync(int id);
}