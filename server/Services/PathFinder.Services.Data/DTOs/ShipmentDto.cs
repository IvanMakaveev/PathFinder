namespace PathFinder.Services.Data.DTOs
{
    using PathFinder.Data.Models;
    using PathFinder.Services.Mapping;

    public class ShipmentDto : IMapFrom<ShipmentModel>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int StartNodeId { get; set; }

        public int EndNodeId { get; set; }
    }
}
