namespace PathFinder.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Data.DTOs;

    public interface IGraphManagementService
    {
        GraphDto GetGraph();

        IList<NodeDto> GetAllNodes();

        NodeDto GetNodeById(int nodeId);

        EdgeDto GetEdgeById(int edgeId);

        IList<NodeModifierDto> GetNodeModifiers(int nodeId);

        Task<int> CreateNodeAsync(string name, NodeType nodeType);

        Task<int> CreateEdgeAsync(int fromNodeId, int toNodeId, int length);

        Task RemoveNodeAsync(int nodeId);

        Task RemoveEdgeAsync(int edgeId);

        Task<int> AddModifierToNodeAsync(int nodeId, NodeModifierType modifierType, int value);

        Task RemoveModifierFromNodeAsync(int modifierId);

        Task ChangeNodeTypeAsync(int nodeId, NodeType nodeType);

        Task ChangeEdgeLengthAsync(int edgeId, int length);
    }
}
