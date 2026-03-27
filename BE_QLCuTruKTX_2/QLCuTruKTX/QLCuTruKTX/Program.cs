using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QLCuTruKTX.Data;
using QLCuTruKTX.Services;
using QLCuTruKTX.Hubs;
using System.Text;
using QLCuTruKTX.Models;

var builder = WebApplication.CreateBuilder(args);

// ====================== 1. DATABASE ======================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// ====================== 2. SERVICES ======================
builder.Services.AddScoped<IMaintenanceService, MaintenanceService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<StatsService>();

// ====================== 3. SIGNALR ======================
builder.Services.AddSignalR();

// ====================== 4. CONTROLLERS ======================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// ====================== 5. SWAGGER ======================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ====================== 6. CORS ======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ====================== 7. AUTHENTICATION ======================
var jwt = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwt["Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwt["Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/chat"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

// ====================== SEED DATA: TẠO 50 SINH VIÊN ======================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        // 1. TẠO ADMIN
        if (!context.Users.Any(u => u.Role == "admin"))
        {
            context.Users.Add(new User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                Role = "admin"
            });
            await context.SaveChangesAsync();
            Console.WriteLine("✅ [SEED] Admin Created.");
        }

        // 2. TẠO TÒA NHÀ & PHÒNG
        if (!context.Buildings.Any())
        {
            Console.WriteLine("⏳ [SEED] Creating Buildings & Rooms...");
            var buildings = new List<Building>
            {
                new Building { Code = "A", Name = "Tòa A" },
                new Building { Code = "B", Name = "Tòa B" },
                new Building { Code = "C", Name = "Tòa C" },
                new Building { Code = "D", Name = "Tòa D" }
            };
            context.Buildings.AddRange(buildings);
            await context.SaveChangesAsync();

            var rooms = new List<Room>();
            foreach (var b in buildings)
            {
                for (int i = 1; i <= 10; i++)
                {
                    rooms.Add(new Room
                    {
                        RoomNumber = $"{b.Code}{100 + i}",
                        Capacity = 8,
                        CurrentOccupancy = 0,
                        Status = "Available",
                        BuildingId = b.Id
                    });
                }
            }
            context.Rooms.AddRange(rooms);
            await context.SaveChangesAsync();
        }

        // 3. TẠO 50 SINH VIÊN & XẾP PHÒNG (THEO YÊU CẦU CỦA BẠN)
        if (!context.Students.Any())
        {
            Console.WriteLine("⏳ [SEED] Creating 50 Students...");
            var students = new List<Student>();
            var users = new List<User>();
            var tenancies = new List<Tenancy>();

            var availableRooms = context.Rooms.ToList();
            int roomIndex = 0;
            var passHash = BCrypt.Net.BCrypt.HashPassword("123456");

            // 🔥 CHỈ CHẠY ĐẾN 50
            for (int i = 1; i <= 50; i++)
            {
                var mssv = $"SV{i:000}"; // SV001 -> SV050
                var s = new Student
                {
                    StudentId = mssv,
                    FullName = $"Sinh Viên Test {i}", // Đặt tên Test cho dễ phân biệt
                    DateOfBirth = DateTime.Now.AddYears(-20),
                    Gender = i % 2 == 0 ? "Nữ" : "Nam",
                    Phone = "090" + i.ToString("0000000"),
                    Email = $"{mssv.ToLower()}@ktx.edu.vn",
                    ClassName = "CNTT_K45",
                    Faculty = "CNTT",
                    IdCard = "012345678" + i,
                    Address = "TP.HCM",
                    Status = "active"
                };
                students.Add(s);
            }

            context.Students.AddRange(students);
            await context.SaveChangesAsync(); // Lưu để lấy ID sinh viên

            // Tạo User và Xếp phòng
            foreach (var s in students)
            {
                users.Add(new User
                {
                    Username = s.StudentId,
                    PasswordHash = passHash,
                    Role = "user",
                    SinhVienId = s.Id
                });

                // Logic xếp phòng (lấp đầy từng phòng)
                if (roomIndex < availableRooms.Count)
                {
                    var room = availableRooms[roomIndex];
                    if (room.CurrentOccupancy < room.Capacity)
                    {
                        tenancies.Add(new Tenancy
                        {
                            StudentId = s.Id,
                            RoomId = room.Id,
                            Status = "active",
                            StartDate = DateTime.Now
                        });
                        room.CurrentOccupancy++;
                    }
                    else
                    {
                        roomIndex++; // Hết chỗ, qua phòng kế tiếp
                        if (roomIndex < availableRooms.Count)
                        {
                            var nextRoom = availableRooms[roomIndex];
                            tenancies.Add(new Tenancy
                            {
                                StudentId = s.Id,
                                RoomId = nextRoom.Id,
                                Status = "active",
                                StartDate = DateTime.Now
                            });
                            nextRoom.CurrentOccupancy++;
                        }
                    }
                }
            }

            context.Users.AddRange(users);
            context.Tenancies.AddRange(tenancies);
            await context.SaveChangesAsync();
            Console.WriteLine("✅ [SEED] DONE! Created 50 Students.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ [SEED ERROR]: " + ex.Message);
    }
}

app.Run();