using Booking.Api.Model;
using Booking.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Booking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Every endpoint in BookingsController requires a valid JWT token!
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bookings = await _bookingService.GetAllBookingsAsync();
        return Ok(bookings);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        if (booking is null)
        {
            return NotFound(new { message = $"Booking with ID {id} not found." });
        }
        return Ok(booking);
    }

    [HttpGet("room/{roomId:int}")]
    public async Task<IActionResult> GetByRoomId(int roomId)
    {
        var bookings = await _bookingService.GetBookingsByRoomIdAsync(roomId);
        return Ok(bookings);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBookingRequest request)
    {
        var result = await _bookingService.CreateBookingAsync(request);

        if (!result.Success)
        {
            return BadRequest(new { message = result.ErrorMessage });
        }

        return CreatedAtAction(nameof(GetById), new { id = result.Booking!.Id }, result.Booking);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var isCanceled = await _bookingService.CancelBookingAsync(id);
        if (!isCanceled)
        {
            return NotFound(new { message = $"Booking with ID {id} not found." });
        }
        return NoContent();
    }
}