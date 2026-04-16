namespace PathFinder.Services.Data
{
    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Mapping;

    public class NodeModifier : IMapFrom<NodeModifierModel>
    {
        public int Id { get; set; }

        public int NodeId { get; set; }

        public int ModifierValue { get; set; }

        public NodeModifierType ModifierType { get; set; }
    }
}
