using System.ComponentModel.DataAnnotations;

namespace TDAPI.Models.Dtos
{
    public record RegisterRequest(
        [Required, EmailAddress] string Email,
        [Required, MinLength(8)] string Password,
        [Required, MinLength(2), MaxLength(100)] string DisplayName);
}
