namespace PathFinder.Data.Models
{
    using System.Collections.Generic;

    using PathFinder.Data.Common.Models;

    public class ShipmentConstraint : BaseDeletableModel<int>
    {
        public ShipmentConstraint()
        {
            this.Children = new HashSet<ShipmentConstraint>();
        }

        public int ShipmentId { get; set; }

        public virtual Shipment Shipment { get; set; }

        public int? ParentId { get; set; }

        public virtual ShipmentConstraint Parent { get; set; }

        public virtual ICollection<ShipmentConstraint> Children { get; set; }
    }
}
