
namespace PathFinder.Services.Data
{
    using System.Collections.Generic;
    using System.Linq;

    public class OrConstraint : ShipmentConstraint
    {
        public ICollection<ShipmentConstraint> Constraints { get; set; }

        public override bool IsSatisfied(Node currentNode, PathFindingContext context)
        {
            return this.Constraints.Any(constraint => constraint.IsSatisfied(currentNode, context));
        }
    }
}
