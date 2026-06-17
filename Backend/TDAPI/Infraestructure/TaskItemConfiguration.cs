using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TDAPI.Models;

namespace TDAPI.Infraestructure;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("Tasks", t =>
            t.HasCheckConstraint(
                "CK_Tasks_Points_Fibonacci",
                "[Points] IN (1, 2, 3, 5, 8, 13, 21)"));

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.Description)
            .HasMaxLength(2000);

        builder.Property(t => t.CreatedAt)
            .HasDefaultValueSql("SYSUTCDATETIME()");

        builder.Property(t => t.UpdatedAt)
            .HasDefaultValueSql("SYSUTCDATETIME()");

        builder.HasOne(t => t.Board)
            .WithMany(b => b.Tasks)
            .HasForeignKey(t => t.BoardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.Status)
            .WithMany(s => s.Tasks)
            .HasForeignKey(t => t.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.AssignedUser)
            .WithMany()
            .HasForeignKey(t => t.AssignedUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(t => t.CreatedBy)
            .WithMany()
            .HasForeignKey(t => t.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(t => t.BoardId);
        builder.HasIndex(t => t.StatusId);
        builder.HasIndex(t => new { t.BoardId, t.StatusId });
    }
}