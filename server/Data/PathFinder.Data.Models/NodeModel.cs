namespace PathFinder.Data.Models
{
    using System.Collections.Generic;

    using PathFinder.Data.Common.Models;
    using PathFinder.Data.Models.Enums;

    public class NodeModel : BaseDeletableModel<int>
    {
        public NodeModel()
        {
            this.InEdges = new HashSet<EdgeModel>();
            this.OutEdges = new HashSet<EdgeModel>();
            this.Modifiers = new HashSet<NodeModifierModel>();
        }

        public string Name { get; set; }

        public NodeType NodeType { get; set; }

        public virtual ICollection<EdgeModel> InEdges { get; set; }

        public virtual ICollection<EdgeModel> OutEdges { get; set; }

        public virtual ICollection<NodeModifierModel> Modifiers { get; set; }
    }
}
