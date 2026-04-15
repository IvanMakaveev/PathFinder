namespace PathFinder.Data.Models
{
    using System.Collections.Generic;

    using PathFinder.Data.Common.Models;
    using PathFinder.Data.Models.Enums;

    public class ShipmentConstraintModel : BaseDeletableModel<int>
    {
        public ShipmentConstraintModel()
        {
            this.Children = new HashSet<ShipmentConstraintModel>();
        }

        public ConstraintType ConstraintType { get; set; }

        public int? Value { get; set; }

        public int ShipmentId { get; set; }

        public virtual ShipmentModel Shipment { get; set; }

        public int? ParentId { get; set; }

        public virtual ShipmentConstraintModel Parent { get; set; }

        public virtual ICollection<ShipmentConstraintModel> Children { get; set; }
    }
}
