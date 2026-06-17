using System.ComponentModel.DataAnnotations;

namespace TDAPI.Dtos.Tasks;

public record CreateTaskRequest(
    [Required, MinLength(2), MaxLength(200)] string Title,
    [MaxLength(2000)] string? Description,
    [Required, AllowedValues(1, 2, 3, 5, 8, 13, 21)] int Points);
