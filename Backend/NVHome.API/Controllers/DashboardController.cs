using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Infrastructure.Data;
using NVHome.Domain.Entities;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Route("api/crm")] // Alias to match frontend call /api/crm/dashboard
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")] // This combined with Route("api/crm") gives /api/crm/dashboard
    public async Task<IActionResult> GetCrmStats()
    {
        var totalCustomers = await _context.Customers.CountAsync();
        
        // Giả sử CustomerStatus: 0 = CAN_LIEN_HE, 1 = DANG_TU_VAN, 2 = DA_KY_HOP_DONG
        var newLeads = await _context.Customers.CountAsync(c => (int)c.Status == 0);
        var inProgress = await _context.Customers.CountAsync(c => (int)c.Status == 1);
        var closedDeals = await _context.Customers.CountAsync(c => (int)c.Status == 2);

        return Ok(new
        {
            totalCustomers,
            newLeads,
            inProgress,
            closedDeals
        });
    }
}
