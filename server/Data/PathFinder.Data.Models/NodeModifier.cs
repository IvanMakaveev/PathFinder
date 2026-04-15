namespace PathFinder.Data.Models
{
    using PathFinder.Data.Common.Models;
    using PathFinder.Data.Models.Enums;

    public class NodeModifier : BaseDeletableModel<int>
    {
        public int NodeId { get; set; }

        public virtual NodeModel Node { get; set; }

        public NodeModifierType ModifierType { get; set; }

        public int ModifierValue { get; set; }
    }
}
