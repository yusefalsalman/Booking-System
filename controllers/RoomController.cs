using Booking.Api.Data;
using Booking.Api.Model;
using Booking.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Booking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;


    // Inject the Service, not the DbContext!
    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // Fetch entities and project directly to RoomResponse DTOs
        var rooms = await _roomService.GetAllRoomsAsync();
        return Ok(rooms);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var room = await _roomService.GetRoomByIdAsync(id);

        if (room is null)
        {
            return NotFound(new { message = $"Room with ID {id} not found." });
        }

        return Ok(room);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")] // Only allow users with the "Admin" role to create rooms
    public async Task<IActionResult> Create(CreateRoomRequest request)
    {
        var newRoom = await _roomService.CreateRoomAsync(request);

        return CreatedAtAction(nameof(GetById), new { id = newRoom.Id }, newRoom);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")] // Only allow users with the "Admin" role to create rooms
    public async Task<IActionResult> Update(int id, CreateRoomRequest request)
    {
        var room = await _roomService.UpdateRoomAsync(id, request);

        if (room is null)
        {
            return NotFound(new { message = $"Room with ID {id} not found." });
        }

        return Ok(room);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")] // Only allow users with the "Admin" role to delete rooms
    public async Task<IActionResult> Delete(int id)
    {
        var room = await _roomService.DeleteRoomAsync(id);
        if (room) // If the room was successfully deleted, return a NoContent response
        {
            return NoContent();
        }

        return NotFound(new { message = $"Room with ID {id} not found." });
    }
}
