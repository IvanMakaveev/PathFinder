namespace PathFinder.Services
{
    using System.Collections.Generic;

    public interface IPathfindingService
    {
        List<string> FindPath(int shipmentId);
    }
}
