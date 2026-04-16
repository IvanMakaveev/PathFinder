namespace PathFinder.Data.Models
{
    using System.Collections.Generic;

    using PathFinder.Data.Common.Models;

    public class ShipmentModel : BaseDeletableModel<int>
    {
        public ShipmentModel()
        {
            this.ShipmentConstraints = new HashSet<ShipmentConstraintModel>();
        }

        public string Name { get; set; }

        public string Description { get; set; }

        public int StartNodeId { get; set; }

        public virtual NodeModel StartNode { get; set; }

        public int EndNodeId { get; set; }

        public virtual NodeModel EndNode { get; set; }

        public virtual ICollection<ShipmentConstraintModel> ShipmentConstraints { get; set; }
    }
}
