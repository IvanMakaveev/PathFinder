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
    public class EdgesController : ControllerBase
    {
        private readonly IGraphManagementService graphManagementService;

        public EdgesController(IGraphManagementService graphManagementService)
        {
            this.graphManagementService = graphManagementService;
        }

        [HttpGet("/edges/{id:int}")]
        public IActionResult GetEdge(int id)
        {
            var edge = this.graphManagementService.GetEdgeById(id);

            return new JsonResult(edge);
        }

        [HttpPut("/edges/{id:int}")]
        public async Task<IActionResult> UpdateEdgeLength(int id, [FromBody] EditEdgeInputModel input)
        {
            try
            {
                await this.graphManagementService.ChangeEdgeLengthAsync(id, input.Length);
                return this.Ok();
            }
            catch (KeyNotFoundException)
            {
                return this.NotFound();
            }
        }

        [HttpDelete("/edges/{id:int}")]
        public async Task<IActionResult> DeleteEdge(int id)
        {
            try
            {
                await this.graphManagementService.RemoveEdgeAsync(id);
                return this.Ok();
            }
            catch (InvalidOperationException)
            {
                return this.BadRequest();
            }
        }

        [HttpPost("/edges")]
        public async Task<IActionResult> CreateEdge([FromBody] CreateEdgeInputModel input)
        {
            try
            {
                var edgeId = await this.graphManagementService.CreateEdgeAsync(input.FromNodeId, input.ToNodeId, input.Length);
                return new JsonResult(edgeId);
            }
            catch (InvalidOperationException)
            {
                return this.BadRequest();
            }
            catch (KeyNotFoundException)
            {
                return this.NotFound();
            }
        }
    }
}
