namespace PathFinder.Services.Data.DTOs
{
    using PathFinder.Data.Models;
    using PathFinder.Services.Mapping;

    public class EdgeDto : IMapFrom<EdgeModel>
    {
        public int Id { get; set; }

        public int FromNodeId { get; set; }

        public int ToNodeId { get; set; }

        public long Length { get; set; }
    }
}
