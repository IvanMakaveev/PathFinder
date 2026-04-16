namespace PathFinder.Services.Data.Constraints
{
    using System.Linq;

    public class OrConstraint : CompositeConstraint
    {
        public override bool IsSatisfied(Node currentNode, PathFindingContext context)
        {
            return this.Constraints.Any(constraint => constraint.IsSatisfied(currentNode, context));
        }
    }
}
