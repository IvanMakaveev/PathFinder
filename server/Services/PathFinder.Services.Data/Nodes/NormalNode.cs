namespace PathFinder.Services.Data.Nodes
{
    using System.Collections.Generic;

    using PathFinder.Data.Models.Enums;

    public class NormalNode : Node
    {
        public NormalNode(int id, string name, Dictionary<NodeModifierType, int> modifiers)
            : base(id, name, modifiers)
        {
        }

        public override void ModifyContext(PathFindingContext context)
        {
            return;
        }
    }
}
