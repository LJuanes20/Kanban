namespace TDAPI.Dtos.Tasks;

public record TaskResponse(
    int Id,
    int BoardId,
    string Title,
    string? Description,
    int StatusId,
    string StatusName,
    int Points,
    string? AssignedUserId,
    string? AssignedUserDisplayName,
    string CreatedById,
    string? CreatedByDisplayName,
    DateTime CreatedAt,
    DateTime UpdatedAt);