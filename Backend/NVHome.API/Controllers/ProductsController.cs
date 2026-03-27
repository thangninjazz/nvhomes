using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Application.DTOs.Products;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // API Nâng cao: Hỗ trợ Filter theo danh mục con, Sorting
    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] Guid? categoryId,
        [FromQuery] string? categorySlug,
        [FromQuery] string? sortOrder)
    {
        var query = _context.Products.Include(p => p.Category).AsQueryable();

        // 1. Lọc theo danh mục
        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }
        else if (!string.IsNullOrEmpty(categorySlug))
        {
            query = query.Where(p => p.Category != null && p.Category.Slug == categorySlug);
        }

        // 2. Sắp xếp (Sorting) dynamic
        query = sortOrder switch
        {
            "price_asc" => query.OrderBy(p => p.DiscountPrice ?? p.OriginalPrice),
            "price_desc" => query.OrderByDescending(p => p.DiscountPrice ?? p.OriginalPrice),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            // Tương lai: "popular" => sortBy views/sales
            _ => query.OrderByDescending(p => p.CreatedAt) // Mặc định là mới nhất
        };

        var products = await query.Select(p => new ProductResponse
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            OriginalPrice = p.OriginalPrice,
            DiscountPrice = p.DiscountPrice,
            DiscountPercent = p.DiscountPercent,
            Description = p.Description,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : string.Empty,
            Images = p.Images,
            CustomOptions = p.CustomOptions,
            CreatedAt = p.CreatedAt
        }).ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProduct(Guid id)
    {
        var p = await _context.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return NotFound("Không tìm thấy sản phẩm.");

        return Ok(new ProductResponse
        {
            Id = p.Id, Name = p.Name, Slug = p.Slug,
            OriginalPrice = p.OriginalPrice, DiscountPrice = p.DiscountPrice,
            DiscountPercent = p.DiscountPercent, Description = p.Description,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : string.Empty,
            Images = p.Images, CustomOptions = p.CustomOptions, CreatedAt = p.CreatedAt
        });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetProductBySlug(string slug)
    {
        var p = await _context.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Slug == slug);
        if (p == null) return NotFound("Không tìm thấy sản phẩm.");

        return Ok(new ProductResponse
        {
            Id = p.Id, Name = p.Name, Slug = p.Slug,
            OriginalPrice = p.OriginalPrice, DiscountPrice = p.DiscountPrice,
            DiscountPercent = p.DiscountPercent, Description = p.Description,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : string.Empty,
            Images = p.Images, CustomOptions = p.CustomOptions, CreatedAt = p.CreatedAt
        });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists) return BadRequest("Danh mục sản phẩm không tồn tại.");

        // Tính % giảm giá tự động nếu có
        double? calcDiscount = null;
        if (request.DiscountPrice.HasValue && request.OriginalPrice > 0)
        {
            calcDiscount = Math.Round((double)(1 - request.DiscountPrice.Value / request.OriginalPrice) * 100, 2);
        }

        var product = new Product
        {
            Name = request.Name,
            Slug = request.Slug,
            OriginalPrice = request.OriginalPrice,
            DiscountPrice = request.DiscountPrice,
            DiscountPercent = calcDiscount,
            Description = request.Description,
            CategoryId = request.CategoryId,
            Images = request.Images,
            CustomOptions = request.CustomOptions
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Thêm sản phẩm thành công.", Id = product.Id });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] CreateProductRequest request)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound("Không tìm thấy sản phẩm.");

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists) return BadRequest("Danh mục sản phẩm không tồn tại.");

        double? calcDiscount = null;
        if (request.DiscountPrice.HasValue && request.OriginalPrice > 0)
            calcDiscount = Math.Round((double)(1 - request.DiscountPrice.Value / request.OriginalPrice) * 100, 2);

        product.Name = request.Name; product.Slug = request.Slug;
        product.OriginalPrice = request.OriginalPrice; product.DiscountPrice = request.DiscountPrice;
        product.DiscountPercent = calcDiscount; product.Description = request.Description;
        product.CategoryId = request.CategoryId; product.Images = request.Images;
        product.CustomOptions = request.CustomOptions; product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Cập nhật sản phẩm thành công." });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound("Không tìm thấy sản phẩm.");

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return Ok(new { Message = "Đã xóa sản phẩm thành công." });
    }
}
