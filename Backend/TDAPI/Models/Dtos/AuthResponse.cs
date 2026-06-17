namespace TDAPI.Models.Dtos
{
    public record AuthResponse(
    string Token,
    DateTime ExpiresAt,
    UserResponse User);
}
