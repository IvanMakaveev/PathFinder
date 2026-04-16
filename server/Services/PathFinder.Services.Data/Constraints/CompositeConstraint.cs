namespace PathFinder.Services.Data.Constraints
{
    using System.Collections.Generic;

    public abstract class CompositeConstraint : ShipmentConstraint
    {
        public ICollection<ShipmentConstraint> Constraints { get; set; }
    }
}
