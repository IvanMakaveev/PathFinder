namespace PathFinder.Services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using PathFinder.Services.Data;

    public interface IShipmentService
    {
        IEnumerable<string> GetShipmentNames();

        Shipment GetShipmentById(int shipmentId);

        Task<int> CreateShipmentAsync(string name, string description, int fromId, int toId);

        Task<int> AddConstraint(int shipmentId, string constraintData);

        Task RemoveConstraint(int shipmentId);
    }
}
