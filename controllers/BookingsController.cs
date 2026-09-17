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

    [Authorize] // This endpoint requires a valid JWT token
    [HttpGet("my-bookings")]
    public async Task<IActionResult> GetMyBookings()
    {
        // this endpoint is protected, so we can safely extract the user ID from the JWT token
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var targetCustomerId))
        {
            return Unauthorized(new { message = "Invalid user token." });
        }

        var bookings = await _bookingService.GetBookingsByCustomerIDAsync(targetCustomerId);
        return Ok(bookings);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateBookingRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var customerId))
        {
            return Unauthorized(new { message = "User not authenticated or invalid token." });
        }

        var result = await _bookingService.CreateBookingAsync(request, customerId);

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