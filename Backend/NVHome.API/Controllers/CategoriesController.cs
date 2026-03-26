using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Application.DTOs.Products;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Lấy Menu theo dạng Tree (Đa cấp) đệ quy
    [HttpGet("tree")]
    public async Task<IActionResult> GetMenuTree()
    {
        // Lấy tất cả các Category hiển thị (IsVisible = true)
        var allCategories = await _context.Categories
            .Where(c => c.IsVisible)
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
                Children = BuildTree(c.Id)
            }).ToList();
        }

        return Ok(BuildTree(null));
    }

    // Flat list cho Admin (không cần auth để admin page load được)
    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.OrderIndex)
            .Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                ParentId = c.ParentId,
                OrderIndex = c.OrderIndex,
                IsVisible = c.IsVisible
            })
            .ToListAsync();

        return Ok(categories);
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
            IsVisible = request.IsVisible
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

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
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
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
        return Ok(new { Message = "Đã xóa danh mục thành công." });
    }
}
