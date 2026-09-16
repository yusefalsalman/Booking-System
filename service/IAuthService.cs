using Booking.Api.Model;

namespace Booking.Api.Services;

public interface IAuthService
{
    Task<(bool Success, string? ErrorMessage, AuthResponse? Response)> RegisterAsync(RegisterRequest request);
    Task<(bool Success, string? ErrorMessage, AuthResponse? Response)> LoginAsync(LoginRequest request);
}