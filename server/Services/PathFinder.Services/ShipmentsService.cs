namespace PathFinder.Services
{
    using PathFinder.Data.Common.Repositories;
    using PathFinder.Data.Models;
    using PathFinder.Services.Data;
    using PathFinder.Services.Data.Constraints;
    using PathFinder.Services.Data.DTOs;
    using PathFinder.Services.Data.Factories;
    using PathFinder.Services.Mapping;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.Json;
    using System.Text.Json.Serialization;
    using System.Threading.Tasks;

    public class ShipmentsService : IShipmentsService
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
                .Select(s => new Shipment
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    StartNodeId = s.StartNodeId,
                    EndNodeId = s.EndNodeId,
                })
                .FirstOrDefault();

            shipment.ShipmentConstraint = ConstraintFactory.BuildConstraintTree(
                this.constraintRepository
                .AllAsNoTracking()
                .Where(c => c.ShipmentId == shipmentId)
                .ToList());

            return shipment;
        }

        public string GetShipmentConstraint(int shipmentId)
        {
            var constraints = this.constraintRepository.AllAsNoTracking()
                .Where(c => c.ShipmentId == shipmentId)
                .ToList();

            if (constraints.Count == 0)
            {
                return null;
            }

            var constraintDtoById = constraints.ToDictionary(
                c => c.Id,
                c => new ConstraintDto { Value = c.Value, ConstraintType = c.ConstraintType });

            var childrenByParentId = constraints
                .Where(c => c.ParentId.HasValue)
                .GroupBy(c => c.ParentId.Value)
                .ToDictionary(g => g.Key, g => g.ToList());

            var root = constraints.Where(c => c.ParentId == null).ToList().Single(); ;

            this.AddChildrenToDto(root.Id, constraintDtoById, childrenByParentId);

            return JsonSerializer.Serialize(constraintDtoById[root.Id], new JsonSerializerOptions
            {
                Converters = { new JsonStringEnumConverter() },
                WriteIndented = true,
            });
        }

        public ShipmentDto GetShipmentData(int shipmentId)
            => this.shipmentRepository
                .AllAsNoTracking()
                .Where(s => s.Id == shipmentId)
                .To<ShipmentDto>()
                .FirstOrDefault();

        public IEnumerable<SimpleShipmentDto> GetShipmentsList()
            => this.shipmentRepository
                .AllAsNoTracking()
                .To<SimpleShipmentDto>()
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

        private void AddChildrenToDto(
            int parentId,
            IDictionary<int, ConstraintDto> constraintById,
            IDictionary<int, List<ShipmentConstraintModel>> childrenByParentId)
        {
            if (!childrenByParentId.TryGetValue(parentId, out var childModels))
            {
                return;
            }

            var parentConstraint = constraintById[parentId];

            foreach (var childModel in childModels)
            {
                var childConstraint = constraintById[childModel.Id];

                parentConstraint.Children.Add(childConstraint);

                this.AddChildrenToDto(childModel.Id, constraintById, childrenByParentId);
            }
        }
    }
}
