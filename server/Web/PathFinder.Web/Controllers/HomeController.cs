namespace PathFinder.Web.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("[controller]/[action]")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        [HttpGet("/")]
        public IActionResult Index()
        {
            return new JsonResult("Test Message");
        }
    }
}
