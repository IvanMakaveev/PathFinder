namespace PathFinder.Services.Data.Constraints
{
    using PathFinder.Data.Models.Enums;

    public class SpecialConstraint : ShipmentConstraint
    {
        public override bool IsSatisfied(Node currentNode, PathFindingContext context)
        {
            return currentNode.Modifiers.ContainsKey(NodeModifierType.SpecializedNode);
        }
    }
}
