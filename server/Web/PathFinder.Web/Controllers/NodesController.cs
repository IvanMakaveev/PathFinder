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
    public class NodesController : ControllerBase
    {
        private readonly IGraphManagementService graphManagementService;

        public NodesController(IGraphManagementService graphManagementService)
        {
            this.graphManagementService = graphManagementService;
        }

        [HttpGet("/nodes")]
        public IActionResult GetNodes()
        {
            var nodes = this.graphManagementService.GetAllNodes();

            return new JsonResult(nodes);
        }

        [HttpGet("/nodes/{id:int}")]
        public IActionResult GetNode(int id)
        {
            var node = this.graphManagementService.GetNodeById(id);

            return new JsonResult(node);
        }

        [HttpGet("/nodes/{id:int}/modifiers")]
        public IActionResult GetNodeModifiers(int id)
        {
            var nodeModifiers = this.graphManagementService.GetNodeModifiers(id);

            return new JsonResult(nodeModifiers);
        }

        [HttpPut("/nodes/{id:int}")]
        public async Task<IActionResult> UpdateNode(int id, [FromBody] EditNodeInputModel input)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            await this.graphManagementService.ChangeNodeTypeAsync(id, Enum.Parse<NodeType>(input.NodeType));

            return this.Ok();
        }

        [HttpDelete("/nodes/{id:int}")]
        public async Task<IActionResult> DeleteNode(int id)
        {
            try
            {
                await this.graphManagementService.RemoveNodeAsync(id);
                return this.Ok();
            }
            catch (InvalidOperationException ie)
            {
                this.ModelState.AddModelError("node", ie.Message);
                return this.BadRequest(this.ModelState);
            }
        }

        [HttpPost("/nodes")]
        public async Task<IActionResult> CreateNode([FromBody] CreateNodeInputModel input)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            var nodeId = await this.graphManagementService.CreateNodeAsync(input.Name, Enum.Parse<NodeType>(input.NodeType));
            return new JsonResult(nodeId);
        }

        [HttpPost("/nodes/{id:int}/modifiers")]
        public async Task<IActionResult> AddNodeModifier(int id, [FromBody] CreateNodeModifierInputModel input)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                var modifierId = await this.graphManagementService.AddModifierToNodeAsync(id, Enum.Parse<NodeModifierType>(input.ModifierType), input.Value);
                return new JsonResult(modifierId);
            }
            catch (InvalidOperationException ie)
            {
                this.ModelState.AddModelError("modifier", ie.Message);
                return this.BadRequest(this.ModelState);
            }
            catch (KeyNotFoundException ke)
            {
                this.ModelState.AddModelError("node", ke.Message);
                return this.NotFound(this.ModelState);
            }
        }

        [HttpDelete("/nodes/modifiers/{id:int}")]
        public async Task<IActionResult> DeleteNodeModifier(int id)
        {
            await this.graphManagementService.RemoveModifierFromNodeAsync(id);
            return this.Ok();
        }
    }
}
