namespace TDAPI.Models
{
    public class Board
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string OwnerId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public ApplicationUser Owner { get; set; } = null!;
        public ICollection<BoardMember> Members { get; set; } = new List<BoardMember>();
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
