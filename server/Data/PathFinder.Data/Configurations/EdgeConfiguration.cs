namespace PathFinder.Data.Configurations
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;
    using PathFinder.Data.Models;

    internal class EdgeConfiguration : IEntityTypeConfiguration<EdgeModel>
    {
        public void Configure(EntityTypeBuilder<EdgeModel> builder)
        {
            builder.HasOne(e => e.FromNode)
                .WithMany(n => n.OutEdges)
                .HasForeignKey(e => e.FromNodeId);

            builder.HasOne(e => e.ToNode)
                .WithMany(n => n.InEdges)
                .HasForeignKey(e => e.ToNodeId);
        }
    }
}
