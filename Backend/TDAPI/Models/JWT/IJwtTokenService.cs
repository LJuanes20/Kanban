namespace TDAPI.Models.JWT
{
    public interface IJwtTokenService
    {
        string GenerateToken(ApplicationUser user);
    }
}
