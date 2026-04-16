namespace PathFinder.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using PathFinder.Services.Data;
    using PathFinder.Services.Data.DTOs;

    public interface IShipmentsService
    {
        IEnumerable<SimpleShipmentDto> GetShipmentsList();

        ShipmentDto GetShipmentData(int shipmentId);

        Shipment GetShipmentById(int shipmentId);

        Task<int> CreateShipmentAsync(string name, string description, int fromId, int toId);

        Task<int> AddConstraint(int shipmentId, string constraintData);

        string GetShipmentConstraint(int shipmentId);

        Task RemoveConstraint(int shipmentId);
    }
}
