namespace PathFinder.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Mvc;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services;
    using PathFinder.Web.ViewModels;

    [ApiController]
    public class ShipmentsController : ControllerBase
    {
        private readonly IShipmentsService shipmentsService;
        private readonly IGraphManagementService graphManagementService;
        private readonly IPathfindingService pathfindingService;

        public ShipmentsController(IShipmentsService shipmentsService, IGraphManagementService graphManagementService, IPathfindingService pathfindingService)
        {
            this.shipmentsService = shipmentsService;
            this.graphManagementService = graphManagementService;
            this.pathfindingService = pathfindingService;
        }

        [HttpGet("/shipments")]
        public IActionResult GetShipments()
        {
            var shipments = this.shipmentsService.GetShipmentsList();

            return new JsonResult(shipments);
        }

        [HttpGet("/shipments/{id}")]
        public IActionResult GetShipmentById(int id)
        {
            var shipment = this.shipmentsService.GetShipmentData(id);

            var shipmentViewModel = new ShipmentViewModel
            {
                Id = shipment.Id,
                Name = shipment.Name,
                Description = shipment.Description,
                StartNodeId = shipment.StartNodeId,
                StartNodeName = this.graphManagementService.GetNodeById(shipment.StartNodeId)?.Name,
                EndNodeId = shipment.EndNodeId,
                EndNodeName = this.graphManagementService.GetNodeById(shipment.EndNodeId)?.Name,
            };

            return new JsonResult(shipmentViewModel);
        }

        [HttpGet("/shipments/{id}/path")]
        public IActionResult GetShipmentPath(int id)
        {
            var path = this.pathfindingService.FindPath(id);

            return new JsonResult(path);
        }

        [HttpPut("/shipments/{id}/constraint")]
        public async Task<IActionResult> UpdateShipmentConstraint(int id, [FromBody] string input)
        {
            try
            {
                await this.shipmentsService.AddConstraint(id, input);
                return this.Ok();
            }
            catch (ArgumentException ae)
            {
                this.ModelState.AddModelError("shipment", ae.Message);
                return this.BadRequest(this.ModelState);
            }
            catch (KeyNotFoundException ke)
            {
                this.ModelState.AddModelError("shipment", ke.Message);
                return this.NotFound(this.ModelState);
            }
        }

        [HttpDelete("/shipments/{id}/constraint")]
        public async Task<IActionResult> DeleteShipmentConstraint(int id)
        {
            await this.shipmentsService.RemoveConstraint(id);
            return this.Ok();
        }

        [HttpGet("/shipments/{id}/constraint")]
        public IActionResult GetShipmentConstraint(int id)
        {
            var constraint = this.shipmentsService.GetShipmentConstraint(id);
            return new JsonResult(constraint);
        }

        [HttpPost("/shipments")]
        public async Task<IActionResult> CreateShipment([FromBody] CreateShipmentInputModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            var shipmentId = await this.shipmentsService.CreateShipmentAsync(model.Name, model.Description, model.StartNodeId, model.EndNodeId);
            return new JsonResult(shipmentId);
        }
    }
}
