namespace PathFinder.Services.Data.Nodes
{
    using System.Collections.Generic;

    using PathFinder.Data.Models.Enums;

    public class BrokenNode : Node
    {
        public BrokenNode(int id, string name, Dictionary<NodeModifierType, int> modifiers)
            : base(id, name, modifiers)
        {
        }

        public override void ModifyContext(PathFindingContext context)
        {
            context.PathRisk++;
        }
    }
}
