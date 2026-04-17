namespace PathFinder.Web.ViewModels
{
    public class ShipmentViewModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int StartNodeId { get; set; }

        public string StartNodeName { get; set; }

        public int EndNodeId { get; set; }

        public string EndNodeName { get; set; }
    }
}
