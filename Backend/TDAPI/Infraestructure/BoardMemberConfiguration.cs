using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TDAPI.Models;

namespace TDAPI.Infraestructure;

public partial class BoardConfiguration
{
    public class BoardMemberConfiguration : IEntityTypeConfiguration<BoardMember>
    {
        public void Configure(EntityTypeBuilder<BoardMember> builder)
        {
            builder.ToTable("BoardMembers");
            builder.HasKey(bm => new { bm.BoardId, bm.UserId });

            builder.Property(bm => bm.JoinedAt)
                .HasDefaultValueSql("SYSUTCDATETIME()");
            builder.HasOne(bm => bm.Board)
                .WithMany(b => b.Members)
                .HasForeignKey(bm => bm.BoardId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(bm => bm.User)
                .WithMany()
                .HasForeignKey(bm => bm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(bm => bm.UserId);
        }
    }
}