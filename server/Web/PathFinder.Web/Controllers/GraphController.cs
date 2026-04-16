namespace PathFinder.Web.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using PathFinder.Services;

    [ApiController]
    public class GraphController : ControllerBase
    {
        private readonly IGraphManagementService graphManagementService;

        public GraphController(IGraphManagementService graphManagementService)
        {
            this.graphManagementService = graphManagementService;
        }

        [HttpGet("/")]
        [HttpGet("/graph")]
        public IActionResult GetGraph()
        {
            var graph = this.graphManagementService.GetGraph();

            return new JsonResult(graph);
        }
    }
}
