using System.ComponentModel.DataAnnotations;

namespace TDAPI.Models.Dtos.Boards
{
    public record CreateBoardRequest(
     [Required, MinLength(2), MaxLength(100)] string Name,
     [MaxLength(500)] string? Description);
}
