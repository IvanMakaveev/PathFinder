namespace PathFinder.Data.Seeding
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;

    public class GraphSeeder : ISeeder
    {
        public async Task SeedAsync(ApplicationDbContext dbContext, IServiceProvider serviceProvider)
        {
            if (dbContext.Nodes.Any())
            {
                return;
            }

            var node7 = new NodeModel
            {
                Name = "Node 7",
                NodeType = NodeType.NormalNode,
                Modifiers = new List<NodeModifierModel>
                {
                    new NodeModifierModel
                    {
                        ModifierType = NodeModifierType.CoolantNode,
                        ModifierValue = -10,
                    },
                },
            };

            var node5 = new NodeModel
            {
                Name = "Node 5",
                NodeType = NodeType.BrokenNode,
                OutEdges = new List<EdgeModel>
                {
                    new EdgeModel
                    {
                        ToNode = node7,
                        Length = 2,
                    },
                },
                Modifiers = new List<NodeModifierModel>
                {
                    new NodeModifierModel
                    {
                        ModifierType = NodeModifierType.CoolantNode,
                        ModifierValue = -5,
                    },
                },
            };

            var node6 = new NodeModel
            {
                Name = "Node 6",
                NodeType = NodeType.NormalNode,
                OutEdges = new List<EdgeModel>
                {
                    new EdgeModel
                    {
                        ToNode = node5,
                        Length = 4,
                    },
                    new EdgeModel
                    {
                        ToNode = node7,
                        Length = 7,
                    },
                },
                Modifiers = new List<NodeModifierModel>
                {
                    new NodeModifierModel
                    {
                        ModifierType = NodeModifierType.CoolantNode,
                        ModifierValue = -10,
                    },
                },
            };

            var node4 = new NodeModel
            {
                Name = "Node 4",
                NodeType = NodeType.NormalNode,
                OutEdges = new List<EdgeModel>
                {
                    new EdgeModel
                    {
                        ToNode = node6,
                        Length = 2,
                    },
                },
                Modifiers = new List<NodeModifierModel>
                {
                    new NodeModifierModel
                    {
                        ModifierType = NodeModifierType.CoolantNode,
                        ModifierValue = -10,
                    },
                },
            };

            var node3 = new NodeModel
            {
                Name = "Node 3",
                NodeType = NodeType.BrokenNode,
                OutEdges = new List<EdgeModel>
                {
                    new EdgeModel
                    {
                        ToNode = node4,
                        Length = 3,
                    },
                    new EdgeModel
                    {
                        ToNode = node5,
                        Length = 1,
                    },
                },
                Modifiers = new List<NodeModifierModel>
                {
                    new NodeModifierModel
                    {
                        ModifierType = NodeModifierType.CoolantNode,
                        ModifierValue = -10,
                    },
                },
            };

            var node2 = new NodeModel
            {
                Name = "Node 2",
                NodeType = NodeType.NormalNode,
                OutEdges = new List<EdgeModel>
                {
                    new EdgeModel
                    {
                        ToNode = node3,
                        Length = 3,
                    },
                    new EdgeModel
                    {
                        ToNode = node4,
                        Length = 16,
                    },
                },
            };

            var node1 = new NodeModel
            {
                Name = "Node 1",
                NodeType = NodeType.NormalNode,
                OutEdges = new List<EdgeModel>
                {
                    new EdgeModel
                    {
                        ToNode = node2,
                        Length = 15,
                    },
                    new EdgeModel
                    {
                        ToNode = node3,
                        Length = 10,
                    },
                },
                Modifiers = new List<NodeModifierModel>
                {
                    new NodeModifierModel
                    {
                        ModifierType = NodeModifierType.CoolantNode,
                        ModifierValue = -10,
                    },
                },
            };

            await dbContext.Nodes.AddAsync(node1);
            await dbContext.SaveChangesAsync();

            var shipment1 = new ShipmentModel
            {
                Name = "Simple Shipment",
                Description = "Just Dijkstra's algorithm",
                StartNodeId = node1.Id,
                EndNodeId = node7.Id,
            };

            var shipment2 = new ShipmentModel
            {
                Name = "Risk Shipment",
                Description = "Risk = Max number of broken nodes",
                StartNodeId = node1.Id,
                EndNodeId = node7.Id,
                ShipmentConstraints = new List<ShipmentConstraintModel>
                {
                    new ShipmentConstraintModel
                    {
                        ConstraintType = ConstraintType.MaxRisk,
                        Value = 1,
                    },
                },
            };

            var andConstraint = new ShipmentConstraintModel
            {
                ConstraintType = ConstraintType.And,
            };

            var shipment3 = new ShipmentModel
            {
                Name = "Complex Shipment",
                Description = "Both constraints must be fulfilled",
                StartNodeId = node1.Id,
                EndNodeId = node7.Id,
                ShipmentConstraints = new List<ShipmentConstraintModel>
                {
                    andConstraint,
                    new ShipmentConstraintModel
                    {
                        ConstraintType = ConstraintType.MaxRisk,
                        Value = 1,
                        Parent = andConstraint,
                    },
                    new ShipmentConstraintModel
                    {
                        ConstraintType = ConstraintType.RequireCooling,
                        Value = -5,
                        Parent = andConstraint,
                    },
                },
            };

            await dbContext.Shipments.AddRangeAsync(shipment1, shipment2, shipment3);
        }
    }
}
