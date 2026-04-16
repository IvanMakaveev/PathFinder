namespace PathFinder.Services.Data.Constraints
{
    using System.Linq;

    public class AndConstraint : CompositeConstraint
    {
        public override bool IsSatisfied(Node currentNode, PathFindingContext context)
        {
            return this.Constraints.All(constraint => constraint.IsSatisfied(currentNode, context));
        }
    }
}
