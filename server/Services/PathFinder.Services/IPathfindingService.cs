namespace PathFinder.Services
{
    using System.Collections.Generic;

    public interface IPathfindingService
    {
        List<int> FindPath(int shipmentId);
    }
}
