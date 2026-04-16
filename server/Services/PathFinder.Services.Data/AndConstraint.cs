
namespace PathFinder.Services.Data
{
    using System.Collections.Generic;
    using System.Linq;

    public class AndConstraint : ShipmentConstraint
    {
        public ICollection<ShipmentConstraint> Constraints { get; set; }

        public override bool IsSatisfied(Node currentNode, PathFindingContext context)
        {
            return this.Constraints.All(constraint => constraint.IsSatisfied(currentNode, context));
        }
    }
}
