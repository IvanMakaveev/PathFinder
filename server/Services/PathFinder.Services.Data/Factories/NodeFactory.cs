namespace PathFinder.Services.Data.Factories
{
    using System;
    using System.Linq;

    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Data.Nodes;

    public static class NodeFactory
    {
        public static Node BuildNode(NodeModel nodeModel)
        {
            var modifiers = nodeModel.Modifiers.ToDictionary(nm => nm.ModifierType, nm => nm.ModifierValue);

            return nodeModel.NodeType switch
            {
                NodeType.NormalNode => new NormalNode(nodeModel.Id, nodeModel.Name, modifiers),
                NodeType.BrokenNode => new BrokenNode(nodeModel.Id, nodeModel.Name, modifiers),
                _ => throw new ArgumentException($"Unsupported node type: {nodeModel.NodeType}"),
            };
        }
    }
}
