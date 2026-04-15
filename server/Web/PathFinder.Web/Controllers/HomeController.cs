namespace PathFinder.Web.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using PathFinder.Services;

    [ApiController]
    [Route("[controller]/[action]")]
    public class HomeController : ControllerBase
    {
        private readonly IPathfindingService pathfindingService;

        public HomeController(IPathfindingService pathfindingService)
        {
            this.pathfindingService = pathfindingService;
        }

        [HttpGet]
        [HttpGet("/")]
        public IActionResult Index()
        {
            return new JsonResult("Test Message");
        }
    }
}
