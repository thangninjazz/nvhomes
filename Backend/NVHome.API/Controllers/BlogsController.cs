using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Application.DTOs.Blogs;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BlogsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Public API: Trả về danh sách bài viết
    [HttpGet]
    public async Task<IActionResult> GetBlogs()
    {
        var blogs = await _context.BlogPosts
            .Include(b => b.Author)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BlogResponse
            {
                Id = b.Id,
                Title = b.Title,
                Slug = b.Slug,
                Content = b.Content,
                Thumbnail = b.Thumbnail,
                AuthorId = b.AuthorId,
                AuthorName = b.Author != null ? b.Author.Email : "Unknown",
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();

        return Ok(blogs);
    }

    // Yêu cầu quyền Admin/Editor: Lấy thông tin người viết (AuthorId) từ JWT tự động
    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<IActionResult> CreateBlog([FromBody] CreateBlogRequest request)
    {
        // Sử dụng NameIdentifier claim được cấp trong JWT để lấy UserId
        var strUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(strUserId, out Guid userId))
        {
            return Unauthorized("Không xác định được tác giả làm hành động này.");
        }

        var blog = new BlogPost
        {
            Title = request.Title,
            Slug = request.Slug,
            Content = request.Content,
            Thumbnail = request.Thumbnail,
            AuthorId = userId
        };

        _context.BlogPosts.Add(blog);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Đăng bài viết thành công.", Id = blog.Id });
    }
}
