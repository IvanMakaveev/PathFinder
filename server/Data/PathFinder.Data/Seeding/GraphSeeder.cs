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
            };

            await dbContext.Nodes.AddAsync(node1);
        }
    }
}
