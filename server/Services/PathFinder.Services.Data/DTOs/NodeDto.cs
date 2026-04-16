namespace PathFinder.Services.Data.DTOs
{
    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Mapping;

    public class NodeDto : IMapFrom<NodeModel>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public NodeType NodeType { get; set; }
    }
}
