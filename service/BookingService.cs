using Booking.Api.Data;
using Booking.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace Booking.Api.Services;

public class BookingService : IBookingService
{
    private readonly BookingDbContext _context;
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
                CustomerId = b.CustomerId,
                RoomName = b.Room.Name,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalPrice = b.TotalPrice,
                RoomId = b.RoomId
            })
            .ToListAsync();
    }

    public async Task<BookingResponse?> GetBookingByIdAsync(int id)
    {
        return await _context.Bookings
            .Where(b => b.Id == id)
            .Select(b => new BookingResponse
            {
                Id = b.Id,
                CustomerId = b.CustomerId,
                RoomName = b.Room.Name,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalPrice = b.TotalPrice,
                RoomId = b.RoomId
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<BookingResponse>> GetBookingsByRoomIdAsync(int roomId)
    {
        return await _context.Bookings
            .Where(b => b.RoomId == roomId)
            .Select(b => new BookingResponse
            {
                Id = b.Id,
                CustomerId = b.CustomerId,
                RoomName = b.Room.Name,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalPrice = b.TotalPrice,
                RoomId = b.RoomId
            })
            .ToListAsync();
    }

    public async Task<bool> CancelBookingAsync(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking is null) return false;

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<(bool Success, string? ErrorMessage, BookingResponse? Booking)> CreateBookingAsync(CreateBookingRequest request, int newID)
    {
        // Business Rule 1: Check if room exists
        var room = await _context.Rooms.FindAsync(request.RoomId);

        if (room is null)
        {
            return (false, $"Room with ID {request.RoomId} does not exist.", null);
        }

        // Business Rule 2: Dates validation
        if (request.CheckOutDate <= request.CheckInDate)
        {
            return (false, "Check-out date must be after check-in date.", null);
        }

        // Business Rule 3: Dates validation
        if (request.CheckInDate < DateTime.UtcNow.Date)
        {
            return (false, "The Booking Must be in Future.", null);
        }

        // Business Rule 4: Prevent Double Booking (Overlap Check)
        var isOverlapping = await _context.Bookings.AnyAsync(b =>
            request.RoomId == b.RoomId &&
            request.CheckInDate < b.CheckOutDate &&
            request.CheckOutDate > b.CheckInDate);

        if (isOverlapping)
        {
            return (false, "This room is already reserved for the selected dates.", null);
        }

        // Business Rule 5: Compute Total Price based on whole calendar days
        var nights = (request.CheckOutDate.Date - request.CheckInDate.Date).Days;
        if (nights < 1) nights = 1;
        var totalPrice = nights * room.PricePerNight;

        var newBooking = new Model.Booking
        {
            CustomerId = newID,
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
            CustomerId = newBooking.CustomerId,
            RoomName = room.Name,
            CheckInDate = newBooking.CheckInDate,
            CheckOutDate = newBooking.CheckOutDate,
            TotalPrice = newBooking.TotalPrice,
            RoomId = newBooking.RoomId
        };
        return (true, null, response);
    }

    public async Task<List<BookingResponse>> GetBookingsByCustomerIDAsync(int id)
    {
        return await _context.Bookings
            .Where(b => b.CustomerId == id)
            .Select(b => new BookingResponse
            {
                Id = b.Id,
                CustomerId = b.CustomerId,
                RoomName = b.Room.Name,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalPrice = b.TotalPrice,
                RoomId = b.RoomId
            })
            .ToListAsync();
    }

}