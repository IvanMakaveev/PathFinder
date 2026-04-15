namespace PathFinder.Services.Data
{
    using PathFinder.Data.Models;
    using PathFinder.Services.Mapping;

    public class Edge : IMapFrom<EdgeModel>
    {
        public int Id { get; set; }

        public int FromNodeId { get; set; }

        public int ToNodeId { get; set; }

        public int Length { get; set; }
    }
}
