namespace PathFinder.Services.Data.DTOs
{
    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Mapping;

    public class NodeModifierDto : IMapFrom<NodeModifierModel>, IHaveCustomMappings
    {
        public int Id { get; set; }

        public int NodeId { get; set; }

        public int ModifierValue { get; set; }

        public string ModifierType { get; set; }

        public void CreateMappings(Mapster.TypeAdapterConfig configuration)
        {
            configuration.ForType<NodeModifierModel, NodeModifierDto>()
                .Map(dest => dest.ModifierType, src => src.ModifierType.ToString());
        }
    }
}
