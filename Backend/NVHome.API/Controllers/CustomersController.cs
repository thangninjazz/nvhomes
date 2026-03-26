using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;
using System.Text;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CustomersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/customers
    [HttpGet]
    public async Task<ActionResult> GetCustomers(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Customers.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(c => c.PhoneNumber.Contains(search) || c.Name.Contains(search));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, items, page, pageSize });
    }

    // GET: api/customers/export → trả về CSV
    [HttpGet("export")]
    public async Task<IActionResult> ExportCsv()
    {
        var customers = await _context.Customers
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        var sb = new StringBuilder();
        sb.AppendLine("PhoneNumber,Status,Note,Source,CreatedAt");

        foreach (var c in customers)
        {
            var note = (c.Note ?? "").Replace(",", ";").Replace("\n", " ");
            sb.AppendLine($"{c.PhoneNumber},{c.Status},{note},{c.Source},{c.CreatedAt:yyyy-MM-dd HH:mm:ss}");
        }

        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
        return File(bytes, "text/csv", $"customers_{DateTime.Now:yyyyMMdd_HHmm}.csv");
    }

    // POST: api/customers
    [HttpPost]
    public async Task<ActionResult<Customer>> CreateCustomer([FromBody] CustomerRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var customer = new Customer
        {
            PhoneNumber = request.PhoneNumber,
            Name = request.Name ?? "",
            Note = request.Note,
            Address = request.Address,
            Source = CustomerSource.Consultation, // Mặc định là tư vấn
            Status = CustomerStatus.CAN_LIEN_HE,
            CreatedAt = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }

    // GET: api/customers/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Customer>> GetCustomer(Guid id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();
        return customer;
    }

    // PUT: api/customers/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] UpdateCustomerRequest request)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        customer.PhoneNumber = request.PhoneNumber;
        customer.Name = request.Name ?? customer.Name;
        customer.Status = request.Status;
        customer.Note = request.Note;
        customer.Address = request.Address;

        await _context.SaveChangesAsync();
        return NoContent();
    }
    // DELETE: api/customers/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(Guid id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class CustomerRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Note { get; set; }
    public string? Address { get; set; }
}

public class UpdateCustomerRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Name { get; set; }
    public CustomerStatus Status { get; set; }
    public string? Note { get; set; }
    public string? Address { get; set; }
}
