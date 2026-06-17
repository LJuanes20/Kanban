using System.ComponentModel.DataAnnotations;

namespace TDAPI.Models.Dtos
{
    public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);
}
