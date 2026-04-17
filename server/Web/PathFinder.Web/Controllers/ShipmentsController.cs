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
        private readonly IPathfindingService pathfindingService;

        public ShipmentsController(IShipmentsService shipmentsService, IPathfindingService pathfindingService)
        {
            this.shipmentsService = shipmentsService;
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

            return new JsonResult(shipment);
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
            catch (ArgumentException ex)
            {
                return this.BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return this.NotFound(ex.Message);
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
            var shipmentId = await this.shipmentsService.CreateShipmentAsync(model.Name, model.Description, model.StartNodeId, model.EndNodeId);
            return new JsonResult(shipmentId);
        }
    }
}
