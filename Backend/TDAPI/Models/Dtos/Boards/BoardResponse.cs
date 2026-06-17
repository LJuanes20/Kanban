namespace TDAPI.Models.Dtos.Boards
{
    public record BoardResponse(
    int Id,
    string Name,
    string? Description,
    DateTime CreatedAt,
    BoardOwnerResponse Owner);
}
