using Microsoft.EntityFrameworkCore;
using NVHome.Infrastructure.Data;
using NVHome.Infrastructure;
using NVHome.Application.Interfaces;
using NVHome.Domain.Entities;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ CORS cho phép Frontend gọi API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
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

var app = builder.Build();

// Cấu hình Http Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Tạm tắt để fix lỗi gọi API HTTP local mượt mà hơn
app.UseForwardedHeaders(); // Cần thiết để nhận diện proto từ Nginx
app.UseCors("AllowAll");

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

        // Seed Admin User nếu chưa có
        if (!context.Users.Any())
        {
            var hasher = services.GetRequiredService<IPasswordHasher>();
            context.Users.Add(new User 
            { 
                Id = Guid.NewGuid(),
                Email = "admin@nvhome.com", 
                PasswordHash = hasher.Hash("admin123"), 
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            });
            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Lỗi khi chạy migration cơ sở dữ liệu.");
    }
}

app.Run();
