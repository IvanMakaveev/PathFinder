namespace PathFinder.Services.Data
{
    public class MaxRiskConstraint : ShipmentConstraint
    {
        public int Value { get; set; }

        public override bool IsSatisfied(Node currentNode, TrackingContext context)
        {
            return context.PathRisk <= this.Value;
        }
    }
}
