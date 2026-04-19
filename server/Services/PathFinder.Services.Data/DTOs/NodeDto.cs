namespace PathFinder.Services.Data.DTOs
{
    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Mapping;

    public class NodeDto : IMapFrom<NodeModel>, IHaveCustomMappings
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string NodeType { get; set; }

        public void CreateMappings(Mapster.TypeAdapterConfig configuration)
        {
            configuration.ForType<NodeModel, NodeDto>()
                .Map(dest => dest.NodeType, src => src.NodeType.ToString());
        }
    }
}
