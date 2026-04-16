namespace PathFinder.Services
{
    using System.Collections.Generic;
    using System.Linq;

    using Microsoft.EntityFrameworkCore;
    using PathFinder.Data.Common.Repositories;
    using PathFinder.Data.Models;
    using PathFinder.Services.Data;
    using PathFinder.Services.Data.Factories;
    using PathFinder.Services.Mapping;

    public class PathfindingService : IPathfindingService
    {
        private readonly IDeletableEntityRepository<NodeModel> nodesRepository;
        private readonly IDeletableEntityRepository<EdgeModel> edgesRepository;
        private readonly IShipmentsService shipmentService;

        private Dictionary<int, Node> nodes;
        private Dictionary<int, List<Edge>> adjacencyList;

        public PathfindingService(
            IDeletableEntityRepository<NodeModel> nodesRepository,
            IDeletableEntityRepository<EdgeModel> edgesRepository,
            IShipmentsService shipmentService)
        {
            this.nodesRepository = nodesRepository;
            this.edgesRepository = edgesRepository;
            this.shipmentService = shipmentService;

            this.LoadGraph();
        }

        public List<string> FindPath(int shipmentId)
        {
            var shipment = this.shipmentService.GetShipmentById(shipmentId);

            return this.GetShortestPath(shipment);
        }

        private List<string> BuildPath(int startId, int endId, Dictionary<int, int> previous)
        {
            List<string> path = new List<string>();

            while (endId != startId)
            {
                path.Add(this.nodes[endId].Name);
                endId = previous[endId];
            }

            path.Add(this.nodes[startId].Name);
            path.Reverse();
            return path;
        }

        private List<string> GetShortestPath(Shipment shipment)
        {
            Dictionary<int, long> dist = this.nodes.ToDictionary(n => n.Key, n => long.MaxValue);
            Dictionary<int, bool> visited = this.nodes.ToDictionary(n => n.Key, n => false);
            Dictionary<int, int> previous = new Dictionary<int, int>();

            dist[shipment.StartNodeId] = 0;
            var pq = new PriorityQueue<PathFindingContext, long>();
            pq.Enqueue(new PathFindingContext(shipment.StartNodeId, 0, 0), 0);

            while (pq.Count > 0)
            {
                var context = pq.Dequeue();

                if (visited[context.CurrentNodeId])
                {
                    continue;
                }

                visited[context.CurrentNodeId] = true;

                if (shipment.EndNodeId == context.CurrentNodeId)
                {
                    return this.BuildPath(shipment.StartNodeId, shipment.EndNodeId, previous);
                }

                foreach (var edge in this.adjacencyList[context.CurrentNodeId])
                {
                    if (visited[edge.ToNodeId])
                    {
                        continue;
                    }

                    var newDistance = context.TotalPathLength + edge.Length;

                    if (dist[edge.ToNodeId] > newDistance)
                    {
                        var newContext = new PathFindingContext(edge.ToNodeId, newDistance, context.PathRisk);
                        this.nodes[edge.ToNodeId].ModifyContext(newContext);

                        if (shipment.ShipmentConstraint == null || shipment.ShipmentConstraint.IsSatisfied(this.nodes[edge.ToNodeId], newContext))
                        {
                            dist[newContext.CurrentNodeId] = newContext.TotalPathLength;
                            previous[newContext.CurrentNodeId] = context.CurrentNodeId;
                            pq.Enqueue(newContext, newContext.TotalPathLength);
                        }
                    }
                }
            }

            return null;
        }

        private void LoadGraph()
        {
            this.nodes = this.nodesRepository
                .AllAsNoTracking()
                .Include(n => n.Modifiers)
                .ToList()
                .Select(n => NodeFactory.BuildNode(n))
                .ToDictionary(n => n.Id);

            this.adjacencyList = this.edgesRepository
                .AllAsNoTracking()
                .To<Edge>()
                .GroupBy(e => e.FromNodeId)
                .ToDictionary(g => g.Key, g => g.ToList());
        }
    }
}
