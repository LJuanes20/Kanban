using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TDAPI.Models;

namespace TDAPI.Infraestructure;

public class StatusConfiguration : IEntityTypeConfiguration<Status>
{
    public void Configure(EntityTypeBuilder<Status> builder)
    {
        builder.ToTable("Statuses");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(s => s.Order)
            .IsRequired();

        builder.HasIndex(s => s.Name).IsUnique();

        builder.HasData(
            new Status { Id = 1, Name = "Backlog", Order = 1 },
            new Status { Id = 2, Name = "In Progress", Order = 2 },
            new Status { Id = 3, Name = "Review", Order = 3 },
            new Status { Id = 4, Name = "Done", Order = 4 }
        );
    }
}