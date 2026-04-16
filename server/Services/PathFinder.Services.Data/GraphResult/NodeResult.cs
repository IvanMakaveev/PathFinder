namespace PathFinder.Services.Data.GraphResult
{
    using PathFinder.Data.Models.Enums;

    public class NodeResult
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public NodeType NodeType { get; set; }
    }
}
