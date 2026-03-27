using Microsoft.EntityFrameworkCore;
using NVHome.Infrastructure.Data;
using NVHome.Infrastructure;
using NVHome.Application.Interfaces;
using NVHome.Domain.Entities;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Http;
using System.Threading.RateLimiting;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
// CI/CD Auto-deploy verification comment

// Cấu hình Serilog để ghi log ra Console và File (Rolling Daily)
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/nvhome-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Thêm bộ nhớ đệm (Caching) cho hệ thống
builder.Services.AddMemoryCache();

// Cấu hình CORS chặt chẽ cho Production
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? new[] { "https://nvhomes.vn" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins) // Chỉ cho phép domain từ config
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Bắt buộc để dùng HttpOnly Cookie
    });
});

// Thêm Rate Limiter để chống DDoS (100 requests mỗi 1 phút cho mỗi IP)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 100;
        opt.QueueLimit = 0;
    });
});

// Thêm dịch vụ Controllers và cấu hình JSON để hỗ trợ Enum dạng String
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Cấu hình ForwardedHeaders để nhận diện HTTPS từ Proxy (Nginx)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Lấy ConnectionString từ appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Cấu hình sử dụng PostgreSQL (Npgsql)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Đăng ký dịch vụ từ Infrastructure (JWT, Hashing...)
builder.Services.AddInfrastructure(builder.Configuration);

// Thêm dịch vụ Antiforgery để bảo vệ các request thay đổi dữ liệu (POST/PUT/DELETE)
builder.Services.AddAntiforgery(options => 
{
    options.HeaderName = "X-XSRF-TOKEN"; // Frontend sẽ gửi token qua header này
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.HttpOnly = false; // Phải để false để JS có thể đọc và gửi lại qua header
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

var app = builder.Build();

// Cấu hình Http Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Áp dụng Rate Limiting
app.UseRateLimiter();

// Middleware thêm Security Headers thủ công
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    // Loosening CSP to allow API connections and common external resources
    context.Response.Headers.Append("Content-Security-Policy", "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://nvhomes.vn;");
    await next();
});

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseCors("ProductionPolicy");

// Đảm bảo thư mục uploads tồn tại
var uploadsDir = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
if (!Directory.Exists(uploadsDir))
{
    Directory.CreateDirectory(uploadsDir);
}

// Cấu hình để truy cập ảnh qua đường dẫn /api/uploads/xxx.webp
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsDir),
    RequestPath = "/api/uploads"
});

// app.UseAntiforgery(); // Tạm tắt để khôi phục chức năng đăng nhập
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Tự động Apply Database Migrations khi start app
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        // context.Database.Migrate(); // Tạm tắt nếu có conflict Model EF9, sẽ chạy tay trên VPS
        Console.WriteLine("Database check: Skipping auto-migrate to avoid EF9 PendingModelChangesWarning conflict.");

        // Seed Admin User nếu chưa có (Với thông tin bảo mật mới)
        if (!context.Users.Any(u => u.Email == "nv_super_admin@nvhome.vn"))
        {
            var hasher = services.GetRequiredService<IPasswordHasher>();
            context.Users.Add(new User 
            { 
                Id = Guid.NewGuid(),
                Email = "nv_super_admin@nvhome.vn", 
                PasswordHash = hasher.Hash("NV_Admin_!@#_2026_Secure_789"), 
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            });
            context.SaveChanges();
            Console.WriteLine("Seed: Created new secure Super Admin user.");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Lỗi khi chạy migration cơ sở dữ liệu.");
    }
}

app.Run();
