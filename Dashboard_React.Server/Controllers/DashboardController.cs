using Business.Interfaces;
using Lombok.NET;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dashboard_React.Server.Controllers
{
    [Authorize]
    [Route("api/v1/[controller]")]
    [AllArgsConstructor]
    public partial class DashboardController : ControllerBase
    {
        private readonly IDashboardServices _dashboardServices;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            int year = DateTime.Now.Year;

            var result = await _dashboardServices.GetOrdersByMonth(year);

            return Ok(result);
        }

        [HttpGet("{month}")]
        public async Task<IActionResult> GetOrdersByDay(int month)
        {
            var result = await _dashboardServices.GetOrdersByDay(month);

            return Ok(result);
        }
    }
}
