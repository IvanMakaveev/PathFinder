namespace PathFinder.Services.Data.Constraints
{
    using PathFinder.Data.Models.Enums;

    public class CoolingConstraint : ShipmentConstraint
    {
        public int Value { get; set; }

        public override bool IsSatisfied(Node currentNode, PathFindingContext context)
        {
            return currentNode.Modifiers.ContainsKey(NodeModifierType.CoolantNode)
                && currentNode.Modifiers[NodeModifierType.CoolantNode] <= this.Value;
        }
    }
}
