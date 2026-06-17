namespace TDAPI.Models
{
    public class BoardMember
    {
        public int BoardId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public DateTime JoinedAt { get; set; }
        public Board Board { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
