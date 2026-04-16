namespace PathFinder.Services.Data
{
    public class PathFindingContext
    {
        public PathFindingContext(int currentNodeId, long totalPathLength, long pathRisk)
        {
            this.CurrentNodeId = currentNodeId;
            this.TotalPathLength = totalPathLength;
            this.PathRisk = pathRisk;
        }

        public int CurrentNodeId { get; set; }

        public long TotalPathLength { get; set; } = 0;

        public long PathRisk { get; set; } = 0;
    }
}
