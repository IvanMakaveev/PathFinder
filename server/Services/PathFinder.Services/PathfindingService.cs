namespace PathFinder.Services
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Mapster;
    using Microsoft.EntityFrameworkCore;
    using PathFinder.Data.Common.Repositories;
    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Data;
    using PathFinder.Services.Data.Factories;
    using PathFinder.Services.Mapping;

    public class PathfindingService : IPathfindingService
    {
        private readonly IDeletableEntityRepository<NodeModel> nodesRepository;
        private readonly IDeletableEntityRepository<EdgeModel> edgesRepository;
        private readonly IDeletableEntityRepository<ShipmentModel> shipmentRepository;
        private readonly IDeletableEntityRepository<ShipmentConstraintModel> constraintRepository;
        private readonly IDeletableEntityRepository<NodeModifier> modifierRepository;

        private Dictionary<int, Node> nodes;
        private Dictionary<int, List<Edge>> adjacencyList;

        public PathfindingService(
            IDeletableEntityRepository<NodeModel> nodesRepository,
            IDeletableEntityRepository<EdgeModel> edgesRepository,
            IDeletableEntityRepository<ShipmentModel> shipmentRepository,
            IDeletableEntityRepository<ShipmentConstraintModel> constraintRepository)
        {
            this.nodesRepository = nodesRepository;
            this.edgesRepository = edgesRepository;
            this.shipmentRepository = shipmentRepository;
            this.constraintRepository = constraintRepository;

            this.LoadGraph();
        }

        private void LoadGraph()
        {
            this.nodes = this.nodesRepository
                .AllAsNoTracking()
                .Include(n => n.Modifiers)
                .ToList()
                .Adapt<List<Node>>()
                .ToDictionary(n => n.Id);

            this.adjacencyList = this.edgesRepository
                .AllAsNoTracking()
                .To<Edge>()
                .GroupBy(e => e.FromNodeId)
                .ToDictionary(g => g.Key, g => g.ToList());
        }

        public List<int> FindPathAsnyc(int shipmentId)
        {
            var shipment = this.shipmentRepository
                .AllAsNoTracking()
                .Where(s => s.Id == shipmentId)
                .To<Shipment>()
                .FirstOrDefault();

            shipment.ShipmentConstraint = ConstraintFactory.BuildConstraintTree(
                this.constraintRepository
                .AllAsNoTracking()
                .Where(c => c.ShipmentId == shipmentId)
                .ToList());

            var context = new TrackingContext();
            return GetShortestPath(shipment, context);
        }

        private List<int> GetShortestPath(Shipment shipment, TrackingContext context)
        {
            return new List<int>();
        }
    }
}
