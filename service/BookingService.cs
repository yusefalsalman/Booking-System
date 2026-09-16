using Booking.Api.Data;
using Booking.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace Booking.Api.Services;

public class BookingService : IBookingService
{
    private readonly BookingDbContext _context;
    private const decimal PricePerNight = 100m; // Example fixed rate per night

    public BookingService(BookingDbContext context)
    {
        _context = context;
    }

    public async Task<List<BookingResponse>> GetAllBookingsAsync()
    {
        return await _context.Bookings
            .Select(b => new BookingResponse
            {
                Id = b.Id,
                CustomerName = b.CustomerName,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalPrice = b.TotalPrice,
                RoomId = b.RoomId
            })
            .ToListAsync();
    }

    public async Task<BookingResponse?> GetBookingByIdAsync(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking is null) return null;

        return new BookingResponse
        {
            Id = booking.Id,
            CustomerName = booking.CustomerName,
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            TotalPrice = booking.TotalPrice,
            RoomId = booking.RoomId
        };
    }

    public async Task<List<BookingResponse>> GetBookingsByRoomIdAsync(int roomId)
    {
        return await _context.Bookings
            .Where(b => b.RoomId == roomId)
            .Select(b => new BookingResponse
            {
                Id = b.Id,
                CustomerName = b.CustomerName,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalPrice = b.TotalPrice,
                RoomId = b.RoomId
            })
            .ToListAsync();
    }

    public async Task<(bool Success, string? ErrorMessage, BookingResponse? Booking)> CreateBookingAsync(CreateBookingRequest request)
    {
        // Business Rule 1: Check if room exists
        var roomExists = await _context.Rooms.AnyAsync(r => r.Id == request.RoomId);
        if (!roomExists)
        {
            return (false, $"Room with ID {request.RoomId} does not exist.", null);
        }

        // Business Rule 2: Dates validation
        if (request.CheckOutDate <= request.CheckInDate)
        {
            return (false, "Check-out date must be after check-in date.", null);
        }

        // Business Rule 3: Prevent Double Booking (Overlap Check)
        var isOverlapping = await _context.Bookings.AnyAsync(b =>
            request.RoomId == b.RoomId &&
            request.CheckInDate < b.CheckOutDate &&
            request.CheckOutDate > b.CheckInDate);

        if (isOverlapping)
        {
            return (false, "This room is already reserved for the selected dates.", null);
        }

        // Business Rule 4: Compute Total Price
        var nights = (request.CheckOutDate - request.CheckInDate).Days;
        var totalPrice = nights * PricePerNight;

        var newBooking = new Model.Booking
        {
            CustomerName = request.CustomerName,
            CheckInDate = request.CheckInDate,
            CheckOutDate = request.CheckOutDate,
            TotalPrice = totalPrice,
            RoomId = request.RoomId
        };

        _context.Bookings.Add(newBooking);
        await _context.SaveChangesAsync();

        var response = new BookingResponse
        {
            Id = newBooking.Id,
            CustomerName = newBooking.CustomerName,
            CheckInDate = newBooking.CheckInDate,
            CheckOutDate = newBooking.CheckOutDate,
            TotalPrice = newBooking.TotalPrice,
            RoomId = newBooking.RoomId
        };
        return (true, null, response);
    }

    public async Task<bool> CancelBookingAsync(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking is null) return false;

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return true;
    }
}

