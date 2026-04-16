namespace PathFinder.Services.Data.DTOs
{
    using PathFinder.Data.Models;
    using PathFinder.Services.Mapping;

    public class SimpleShipmentDto : IMapFrom<ShipmentModel>
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}
