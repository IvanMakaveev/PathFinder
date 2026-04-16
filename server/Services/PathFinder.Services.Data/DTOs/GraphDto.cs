namespace PathFinder.Services.Data.DTOs
{
    using System.Collections.Generic;

    public class GraphDto
    {
        public IEnumerable<NodeDto> Nodes { get; set; }

        public IEnumerable<EdgeDto> Edges { get; set; }
    }
}
