namespace PathFinder.Services.Data
{
    public class MaxLengthConstraint : ShipmentConstraint
    {
        public int Value { get; set; }

        public override bool IsSatisfied(Node currentNode, TrackingContext context)
        {
            return context.TotalPathLength <= this.Value;
        }
    }
}
