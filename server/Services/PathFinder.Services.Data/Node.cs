namespace PathFinder.Services.Data
{
    using System.Collections.Generic;
    using System.Linq;

    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Mapping;

    public class Node : IMapFrom<NodeModel>, IHaveCustomMappings
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public NodeType NodeType { get; set; }

        public Dictionary<NodeModifierType, int> Modifiers { get; set; }

        public void CreateMappings(Mapster.TypeAdapterConfig configuration)
        {
            configuration.NewConfig<NodeModel, Node>()
                .Map(dest => dest.Modifiers, src => src.Modifiers != null
                    ? src.Modifiers.ToDictionary(
                        nm => nm.ModifierType,
                        nm => nm.ModifierValue)
                    : new Dictionary<NodeModifierType, int>());
        }
    }
}
