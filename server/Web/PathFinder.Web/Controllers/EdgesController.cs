namespace PathFinder.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.ModelBinding;
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
            var edgeViewModel = new EdgeViewModel
            {
                Id = edge.Id,
                FromNodeId = edge.FromNodeId,
                FromNodeName = this.graphManagementService.GetNodeById(edge.FromNodeId)?.Name,
                ToNodeId = edge.ToNodeId,
                ToNodeName = this.graphManagementService.GetNodeById(edge.ToNodeId)?.Name,
                Length = edge.Length,
            };

            return new JsonResult(edgeViewModel);
        }

        [HttpPut("/edges/{id:int}")]
        public async Task<IActionResult> UpdateEdgeLength(int id, [FromBody] EditEdgeInputModel input)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                await this.graphManagementService.ChangeEdgeLengthAsync(id, input.Length);
                return this.Ok();
            }
            catch (KeyNotFoundException ke)
            {
                this.ModelState.AddModelError("edge", ke.Message);
                return this.NotFound(this.ModelState);
            }
        }

        [HttpDelete("/edges/{id:int}")]
        public async Task<IActionResult> DeleteEdge(int id)
        {
            await this.graphManagementService.RemoveEdgeAsync(id);
            return this.Ok();
        }

        [HttpPost("/edges")]
        public async Task<IActionResult> CreateEdge([FromBody] CreateEdgeInputModel input)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            try
            {
                var edgeId = await this.graphManagementService.CreateEdgeAsync(input.FromNodeId, input.ToNodeId, input.Length);
                return new JsonResult(edgeId);
            }
            catch (InvalidOperationException ie)
            {
                this.ModelState.AddModelError("edge", ie.Message);
                return this.BadRequest(this.ModelState);
            }
            catch (ArgumentException ae)
            {
                this.ModelState.AddModelError("edge", ae.Message);
                return this.BadRequest(this.ModelState);
            }
            catch (KeyNotFoundException ke)
            {
                this.ModelState.AddModelError("nodes", ke.Message);
                return this.NotFound();
            }
        }
    }
}
