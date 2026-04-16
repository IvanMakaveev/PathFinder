namespace PathFinder.Services.Data.GraphResult
{
    using System.Collections.Generic;

    public class Graph
    {
        public IEnumerable<NodeResult> Nodes { get; set; }

        public IEnumerable<EdgeResult> Edges { get; set; }
    }
}
