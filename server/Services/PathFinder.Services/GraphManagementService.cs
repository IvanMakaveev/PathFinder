namespace PathFinder.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using PathFinder.Data.Common.Repositories;
    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Data.DTOs;
    using PathFinder.Services.Mapping;

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

        public EdgeDto GetEdge(int edgeId)
            => this.edgesRepository.AllAsNoTracking()
                .Where(e => e.Id == edgeId)
                .To<EdgeDto>()
                .FirstOrDefault();

        public GraphDto GetGraph()
            => new GraphDto
            {
                Nodes = this.nodesRepository.AllAsNoTracking().To<NodeDto>().ToList(),
                Edges = this.edgesRepository.AllAsNoTracking().To<EdgeDto>().ToList(),
            };

        public NodeDto GetNodeById(int nodeId)
            => this.nodesRepository.AllAsNoTracking()
                .Where(n => n.Id == nodeId)
                .To<NodeDto>()
                .FirstOrDefault();

        public IList<NodeModifierDto> GetNodeModifiers(int nodeId)
            => this.nodeModifiersRepository.All()
                .Where(m => m.NodeId == nodeId)
                .Select(m => new NodeModifierDto
                {
                    Id = m.Id,
                    NodeId = m.NodeId,
                    ModifierType = m.ModifierType,
                    ModifierValue = m.ModifierValue,
                })
                .ToList();

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
            var node = this.nodesRepository.All().Include(n => n.InEdges).Include(n => n.OutEdges).FirstOrDefault(n => n.Id == nodeId);

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
