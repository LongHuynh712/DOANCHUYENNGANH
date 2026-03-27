using Microsoft.AspNetCore.Mvc;
using QLCuTruKTX.Services;

namespace QLCuTruKTX.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly StatsService _stats;

    public DashboardController(StatsService stats)
    {
        _stats = stats;
    }

    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        return Ok(_stats.GetStats());
    }
}
