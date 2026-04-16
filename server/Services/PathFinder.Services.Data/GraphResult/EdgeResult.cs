namespace PathFinder.Services.Data.GraphResult
{
    public class EdgeResult
    {
        public int Id { get; set; }

        public int FromNodeId { get; set; }

        public int ToNodeId { get; set; }

        public long Length { get; set; }
    }
}
