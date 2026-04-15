namespace PathFinder.Data.Models
{
    using PathFinder.Data.Common.Models;

    public class Shipment : BaseDeletableModel<int>
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public int StartNodeId { get; set; }

        public virtual NodeModel StartNode { get; set; }

        public int EndNodeId { get; set; }

        public virtual NodeModel EndNode { get; set; }

        public virtual ShipmentConstraint ShipmentConstraint { get; set; }
    }
}
