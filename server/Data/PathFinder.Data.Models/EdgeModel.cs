namespace PathFinder.Data.Models
{
    using PathFinder.Data.Common.Models;

    public class EdgeModel : BaseDeletableModel<int>
    {
        public int FromNodeId { get; set; }

        public virtual NodeModel FromNode { get; set; }

        public int ToNodeId { get; set; }

        public virtual NodeModel ToNode { get; set; }

        public int Length { get; set; }
    }
}
