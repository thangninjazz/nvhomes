using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Application.DTOs.Products;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;
using Microsoft.Extensions.Caching.Memory;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    private const string CategoryTreeCacheKey = "CategoryTree_";

    public CategoriesController(ApplicationDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    private void ClearCategoryCache()
    {
        // Xóa cache cho mọi type và trạng thái ẩn/hiện
        _cache.Remove($"{CategoryTreeCacheKey}Product_true");
        _cache.Remove($"{CategoryTreeCacheKey}Product_false");
        _cache.Remove($"{CategoryTreeCacheKey}Project_true");
        _cache.Remove($"{CategoryTreeCacheKey}Project_false");
    }

    // Lấy Menu theo dạng Tree (Đa cấp) đệ quy
    [HttpGet("tree")]
    public async Task<IActionResult> GetMenuTree([FromQuery] string type = "Product", [FromQuery] bool includeHidden = false)
    {
        var cacheKey = $"{CategoryTreeCacheKey}{type}_{includeHidden}";
        
        if (_cache.TryGetValue(cacheKey, out List<CategoryResponse>? cachedTree))
        {
            return Ok(cachedTree);
        }

        // Chuyển đổi string sang Enum
        if (!Enum.TryParse<CategoryType>(type, true, out var catType))
        {
            catType = CategoryType.Product;
        }

        // Lấy tất cả các Category thuộc Type tương ứng (Lọc theo IsVisible nếu không includeHidden)
        var query = _context.Categories.Where(c => c.Type == catType);
        
        if (!includeHidden)
        {
            query = query.Where(c => c.IsVisible);
        }

        var allCategories = await query
            .OrderBy(c => c.OrderIndex)
            .ToListAsync();

        var lookup = allCategories.ToLookup(c => c.ParentId);

        // Hàm đệ quy xây dựng cây
        List<CategoryResponse> BuildTree(Guid? parentId)
        {
            return lookup[parentId].Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                ParentId = c.ParentId,
                OrderIndex = c.OrderIndex,
                IsVisible = c.IsVisible,
                Type = c.Type.ToString(),
                Children = BuildTree(c.Id)
            }).ToList();
        }

        var result = BuildTree(null);

        // Lưu vào cache trong 30 phút
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));

        return Ok(result);
    }

    // Flat list cho Admin (không cần auth để admin page load được)
    [HttpGet]
    public async Task<IActionResult> GetCategories([FromQuery] string? type)
    {
        IQueryable<Category> query = _context.Categories;

        if (!string.IsNullOrEmpty(type) && Enum.TryParse<CategoryType>(type, true, out var catType))
        {
            query = query.Where(c => c.Type == catType);
        }

        var categories = await query
            .OrderBy(c => c.OrderIndex)
            .ToListAsync();

        var response = categories.Select(c => new CategoryResponse
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            ParentId = c.ParentId,
            OrderIndex = c.OrderIndex,
            IsVisible = c.IsVisible,
            Type = c.Type.ToString()
        }).ToList();

        return Ok(response);
    }

    [HttpGet("byslug/{slug}")]
    public async Task<IActionResult> GetCategoryBySlug(string slug)
    {
        var category = await _context.Categories
            .Include(c => c.Parent)
            .FirstOrDefaultAsync(c => c.Slug == slug);

        if (category == null) return NotFound("Không tìm thấy danh mục.");

        return Ok(new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            ParentId = category.ParentId,
            ParentName = category.Parent?.Name,
            ParentSlug = category.Parent?.Slug,
            OrderIndex = category.OrderIndex,
            IsVisible = category.IsVisible,
            Type = category.Type.ToString()
        });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Slug = request.Slug,
            ParentId = request.ParentId,
            OrderIndex = request.OrderIndex,
            IsVisible = request.IsVisible,
            Type = Enum.TryParse<CategoryType>(request.Type, true, out var catType) ? catType : CategoryType.Product
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        ClearCategoryCache();

        return Ok(new { Message = "Đã tạo danh mục thành công.", Id = category.Id });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CreateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound("Không tìm thấy danh mục.");

        category.Name = request.Name;
        category.Slug = request.Slug;
        category.ParentId = request.ParentId;
        category.OrderIndex = request.OrderIndex;
        category.IsVisible = request.IsVisible;
        category.Type = Enum.TryParse<CategoryType>(request.Type, true, out var catType) ? catType : category.Type;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        
        ClearCategoryCache();
        
        return Ok(new { Message = "Cập nhật danh mục thành công." });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound("Không tìm thấy danh mục.");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        
        ClearCategoryCache();
        
        return Ok(new { Message = "Đã xóa danh mục thành công." });
    }
}
