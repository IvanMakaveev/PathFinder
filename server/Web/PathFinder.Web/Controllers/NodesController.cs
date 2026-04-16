namespace PathFinder.Web.Controllers
{
    using System;
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

        [HttpGet("/nodes/{id}")]
        public IActionResult GetNode(int id)
        {
            var node = this.graphManagementService.GetNodeById(id);

            return new JsonResult(node);
        }

        [HttpGet("/nodes/{id}/modifiers")]
        public IActionResult GetNodeModifiers(int id)
        {
            var nodeModifiers = this.graphManagementService.GetNodeModifiers(id);

            return new JsonResult(nodeModifiers);
        }

        [HttpPut("/nodes/{id}")]
        public async Task<IActionResult> UpdateNode(int id, [FromBody] EditNodeInputModel input)
        {
            await this.graphManagementService.ChangeNodeTypeAsync(id, Enum.Parse<NodeType>(input.NodeType));

            return this.Ok();
        }

        [HttpDelete("/nodes/{id}")]
        public async Task<IActionResult> DeleteNode(int id)
        {
            try
            {
                await this.graphManagementService.RemoveNodeAsync(id);
                return this.Ok();
            }
            catch (InvalidOperationException)
            {
                return this.BadRequest();
            }
        }
    }
}
