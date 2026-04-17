namespace PathFinder.Web.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.ModelBinding;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services;
    using PathFinder.Web.ViewModels;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

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
            catch (KeyNotFoundException ke)
            {
                this.ModelState.AddModelError("nodes", ke.Message);
                return this.NotFound();
            }
        }
    }
}
