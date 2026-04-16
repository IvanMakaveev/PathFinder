namespace PathFinder.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.Json;
    using System.Text.Json.Serialization;
    using System.Threading.Tasks;

    using PathFinder.Data.Common.Repositories;
    using PathFinder.Data.Models;
    using PathFinder.Services.Data;
    using PathFinder.Services.Data.Factories;
    using PathFinder.Services.Mapping;

    public class ShipmentsService : IShipmentService
    {
        private readonly IDeletableEntityRepository<ShipmentModel> shipmentRepository;
        private readonly IDeletableEntityRepository<ShipmentConstraintModel> constraintRepository;

        public ShipmentsService(
            IDeletableEntityRepository<ShipmentModel> shipmentRepository,
            IDeletableEntityRepository<ShipmentConstraintModel> constraintRepository)
        {
            this.shipmentRepository = shipmentRepository;
            this.constraintRepository = constraintRepository;
        }

        public async Task<int> AddConstraint(int shipmentId, string constraintData)
        {
            if (string.IsNullOrWhiteSpace(constraintData))
            {
                throw new ArgumentException("Constraint data cannot be null or empty.", nameof(constraintData));
            }

            var shipmentExists = this.shipmentRepository
                .AllAsNoTracking()
                .Any(s => s.Id == shipmentId);

            if (!shipmentExists)
            {
                throw new KeyNotFoundException($"Shipment with id {shipmentId} was not found.");
            }

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            jsonOptions.Converters.Add(new JsonStringEnumConverter());

            var rootDto = JsonSerializer.Deserialize<ConstraintDto>(constraintData, jsonOptions);

            if (rootDto == null)
            {
                throw new InvalidOperationException("Constraint tree JSON could not be deserialized.");
            }

            await this.RemoveConstraint(shipmentId);

            var rootModel = this.BuildConstraintModelTree(rootDto, shipmentId, null);

            await this.constraintRepository.AddAsync(rootModel);
            await this.constraintRepository.SaveChangesAsync();

            return rootModel.Id;
        }

        public async Task<int> CreateShipmentAsync(string name, string description, int fromId, int toId)
        {
            var shipment = new ShipmentModel
            {
                Name = name,
                Description = description,
                StartNodeId = fromId,
                EndNodeId = toId,
            };

            await this.shipmentRepository.AddAsync(shipment);
            await this.shipmentRepository.SaveChangesAsync();

            return shipment.Id;
        }

        public Shipment GetShipmentById(int shipmentId)
        {
            var shipment = this.shipmentRepository
                .AllAsNoTracking()
                .Where(s => s.Id == shipmentId)
                .To<Shipment>()
                .FirstOrDefault();

            shipment.ShipmentConstraint = ConstraintFactory.BuildConstraintTree(
                this.constraintRepository
                .AllAsNoTracking()
                .Where(c => c.ShipmentId == shipmentId)
                .ToList());

            return shipment;
        }

        public IEnumerable<string> GetShipmentNames()
            => this.shipmentRepository
                .AllAsNoTracking()
                .Select(s => s.Name)
                .ToList();

        public async Task RemoveConstraint(int shipmentId)
        {
            var constraints = this.constraintRepository.All().Where(c => c.ShipmentId == shipmentId).ToList();
            foreach (var constraint in constraints)
            {
                this.constraintRepository.Delete(constraint);
            }

            await this.constraintRepository.SaveChangesAsync();
        }

        private ShipmentConstraintModel BuildConstraintModelTree(
            ConstraintDto dto,
            int shipmentId,
            ShipmentConstraintModel parent)
        {
            var model = new ShipmentConstraintModel
            {
                ConstraintType = dto.ConstraintType,
                Value = dto.Value,
                ShipmentId = shipmentId,
                Parent = parent,
            };

            if (dto.Children != null && dto.Children.Count > 0)
            {
                foreach (var childDto in dto.Children)
                {
                    var childModel = this.BuildConstraintModelTree(childDto, shipmentId, model);
                    model.Children.Add(childModel);
                }
            }

            return model;
        }
    }
}
