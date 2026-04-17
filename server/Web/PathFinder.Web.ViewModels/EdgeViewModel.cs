namespace PathFinder.Web.ViewModels
{
    public class EdgeViewModel
    {
        public int Id { get; set; }

        public int FromNodeId { get; set; }

        public string FromNodeName { get; set; }

        public int ToNodeId { get; set; }

        public string ToNodeName { get; set; }

        public double Length { get; set; }
    }
}
