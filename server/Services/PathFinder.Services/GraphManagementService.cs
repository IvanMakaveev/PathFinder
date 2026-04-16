namespace PathFinder.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using PathFinder.Data.Common.Repositories;
    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Data;
    using PathFinder.Services.Data.GraphResult;

    public class GraphManagementService : IGraphManagementService
    {
        private readonly IDeletableEntityRepository<NodeModel> nodesRepository;
        private readonly IDeletableEntityRepository<EdgeModel> edgesRepository;
        private readonly IDeletableEntityRepository<NodeModifierModel> nodeModifiersRepository;

        public GraphManagementService(
            IDeletableEntityRepository<NodeModel> nodesRepository,
            IDeletableEntityRepository<EdgeModel> edgesRepository,
            IDeletableEntityRepository<NodeModifierModel> nodeModifiersRepository)
        {
            this.nodesRepository = nodesRepository;
            this.edgesRepository = edgesRepository;
            this.nodeModifiersRepository = nodeModifiersRepository;
        }

        public async Task<int> AddModifierToNodeAsync(int nodeId, NodeModifierType modifierType, int value)
        {
            var modifier = new NodeModifierModel
            {
                NodeId = nodeId,
                ModifierType = modifierType,
                ModifierValue = value,
            };

            await this.nodeModifiersRepository.AddAsync(modifier);
            await this.nodeModifiersRepository.SaveChangesAsync();

            return modifier.Id;
        }

        public async Task ChangeNodeModifierAsync(int modifierId, NodeModifierType modifierType, int value)
        {
            var modifier = this.nodeModifiersRepository.All().FirstOrDefault(m => m.Id == modifierId);

            if (modifier == null)
            {
                throw new KeyNotFoundException($"Modifier with ID {modifierId} not found.");
            }

            modifier.ModifierType = modifierType;
            modifier.ModifierValue = value;
            await this.nodeModifiersRepository.SaveChangesAsync();
        }

        public async Task ChangeNodeTypeAsync(int nodeId, NodeType nodeType)
        {
            var node = this.nodesRepository.All().FirstOrDefault(n => n.Id == nodeId);

            if (node == null)
            {
                throw new KeyNotFoundException($"Node with ID {nodeId} not found.");
            }

            node.NodeType = nodeType;
            await this.nodesRepository.SaveChangesAsync();
        }

        public async Task<int> CreateEdgeAsync(int fromNodeId, int toNodeId, int length)
        {
            var edge = new EdgeModel
            {
                FromNodeId = fromNodeId,
                ToNodeId = toNodeId,
                Length = length,
            };

            await this.edgesRepository.AddAsync(edge);
            await this.edgesRepository.SaveChangesAsync();

            return edge.Id;
        }

        public async Task<int> CreateNodeAsync(string name, NodeType nodeType)
        {
            var node = new NodeModel
            {
                Name = name,
                NodeType = nodeType,
            };

            await this.nodesRepository.AddAsync(node);
            await this.nodesRepository.SaveChangesAsync();

            return node.Id;
        }

        public Graph GetGraph()
        {
            return new Graph
            {
                Nodes = this.nodesRepository.All().Select(n => new NodeResult
                {
                    Id = n.Id,
                    Name = n.Name,
                    NodeType = n.NodeType,
                }).ToList(),
                Edges = this.edgesRepository.All().Select(e => new EdgeResult
                {
                    Id = e.Id,
                    FromNodeId = e.FromNodeId,
                    ToNodeId = e.ToNodeId,
                    Length = e.Length,
                }).ToList(),
            };
        }

        public IList<NodeModifier> GetNodeModifiers(int nodeId)
        {
            return this.nodeModifiersRepository.All()
                .Where(m => m.NodeId == nodeId)
                .Select(m => new NodeModifier
                {
                    Id = m.Id,
                    NodeId = m.NodeId,
                    ModifierType = m.ModifierType,
                    ModifierValue = m.ModifierValue,
                })
                .ToList();
        }

        public async Task RemoveEdgeAsync(int edgeId)
        {
            var edge = this.edgesRepository.All().FirstOrDefault(e => e.Id == edgeId);

            if (edge != null)
            {
                this.edgesRepository.Delete(edge);
                await this.edgesRepository.SaveChangesAsync();
            }
        }

        public async Task RemoveModifierFromNodeAsync(int modifierId)
        {
            var modifier = this.nodeModifiersRepository.All().FirstOrDefault(m => m.Id == modifierId);

            if (modifier != null)
            {
                this.nodeModifiersRepository.Delete(modifier);
                await this.nodeModifiersRepository.SaveChangesAsync();
            }
        }

        public async Task RemoveNodeAsync(int nodeId)
        {
            var node = this.nodesRepository.All().FirstOrDefault(n => n.Id == nodeId);

            if (node != null)
            {
                if (node.InEdges.Count > 0 || node.OutEdges.Count > 0)
                {
                    throw new InvalidOperationException("Cannot delete a node that has connected edges. Please remove the edges first.");
                }

                this.nodesRepository.Delete(node);
                await this.nodesRepository.SaveChangesAsync();
            }
        }
    }
}
