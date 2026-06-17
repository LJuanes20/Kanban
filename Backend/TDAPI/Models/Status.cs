namespace TDAPI.Models
{
    public class Status
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }

        // Navegación
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
