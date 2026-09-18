using Booking.Api.Model;
using Booking.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Booking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("recommend")]
    public async Task<IActionResult> Recommend([FromBody] AIRecommendationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Prompt))
            return BadRequest(new { message = "Prompt cannot be empty." });

        try
        {
            var result = await _aiService.GetRoomRecommendationAsync(request.Prompt);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "AI recommendation failed.", details = ex.Message });
        }
    }
}