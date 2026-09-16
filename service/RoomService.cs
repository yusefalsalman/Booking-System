using Booking.Api.Data;
using Booking.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace Booking.Api.Services;

public class RoomService : IRoomService
{
    private readonly BookingDbContext _context;

    // Inject the DbContext here in the Service, NOT in the Controller
    public RoomService(BookingDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoomResponse>> GetAllRoomsAsync()
    {
        return await _context.Rooms
            .Select(r => new RoomResponse
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.Capacity
            })
            .ToListAsync();
    }

    public async Task<RoomResponse?> GetRoomByIdAsync(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room is null) return null;

        return new RoomResponse
        {
            Id = room.Id,
            Name = room.Name,
            Capacity = room.Capacity
        };
    }

    public async Task<RoomResponse> CreateRoomAsync(CreateRoomRequest request)
    {
        var newRoom = new Room
        {
            Name = request.Name,
            Capacity = request.Capacity
        };

        _context.Rooms.Add(newRoom);
        await _context.SaveChangesAsync();

        return new RoomResponse
        {
            Id = newRoom.Id,
            Name = newRoom.Name,
            Capacity = newRoom.Capacity
        };
    }

    public async Task<RoomResponse?> UpdateRoomAsync(int id, CreateRoomRequest request)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room is null) return null;

        room.Name = request.Name;
        room.Capacity = request.Capacity;

        await _context.SaveChangesAsync();

        return new RoomResponse
        {
            Id = room.Id,
            Name = room.Name,
            Capacity = room.Capacity
        };
    }

    public async Task<bool> DeleteRoomAsync(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room is null) return false;

        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();

        return true;
    }
}