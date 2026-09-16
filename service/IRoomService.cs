using Booking.Api.Model;

namespace Booking.Api.Services;

public interface IRoomService
{
    Task<List<RoomResponse>> GetAllRoomsAsync();
    Task<RoomResponse?> GetRoomByIdAsync(int id);
    Task<RoomResponse> CreateRoomAsync(CreateRoomRequest request);
    Task<RoomResponse?> UpdateRoomAsync(int id, CreateRoomRequest request);
    Task<bool> DeleteRoomAsync(int id);
}