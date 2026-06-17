namespace TDAPI.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public int BoardId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int StatusId { get; set; }
        public int Points { get; set; }
        public string? AssignedUserId { get; set; }
        public string CreatedById { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Navegaciones
        public Board Board { get; set; } = null!;
        public Status Status { get; set; } = null!;
        public ApplicationUser? AssignedUser { get; set; }
        public ApplicationUser CreatedBy { get; set; } = null!;
    }
}
