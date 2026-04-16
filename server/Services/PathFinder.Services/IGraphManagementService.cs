namespace PathFinder.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Data;
    using PathFinder.Services.Data.GraphResult;

    public interface IGraphManagementService
    {
        Graph GetGraph();

        IList<NodeModifier> GetNodeModifiers(int nodeId);

        Task<int> CreateNodeAsync(string name, NodeType nodeType);

        Task<int> CreateEdgeAsync(int fromNodeId, int toNodeId, int length);

        Task RemoveNodeAsync(int nodeId);

        Task RemoveEdgeAsync(int edgeId);

        Task<int> AddModifierToNodeAsync(int nodeId, NodeModifierType modifierType, int value);

        Task RemoveModifierFromNodeAsync(int modifierId);

        Task ChangeNodeTypeAsync(int nodeId, NodeType nodeType);

        Task ChangeNodeModifierAsync(int modifierId, NodeModifierType modifierType, int value);
    }
}
