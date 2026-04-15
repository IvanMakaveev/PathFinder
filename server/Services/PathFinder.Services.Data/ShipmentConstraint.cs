namespace PathFinder.Services.Data
{
    public abstract class ShipmentConstraint
    {
        public int Id { get; set; }

        public abstract bool IsSatisfied(Node currentNode, TrackingContext context);
    }
}
