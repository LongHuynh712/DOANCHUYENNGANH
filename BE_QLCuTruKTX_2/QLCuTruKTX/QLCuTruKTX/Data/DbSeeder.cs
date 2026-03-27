using QLCuTruKTX.Data;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Seeders
{
    public static class SeedData
    {
        public static async Task SeedAsync(ApplicationDbContext db)
        {
            // ====================== SEED BUILDINGS ======================
            if (!db.Buildings.Any())
            {
                db.Buildings.AddRange(
                    new Building { Code = "A", Name = "Tòa A" },
                    new Building { Code = "B", Name = "Tòa B" },
                    new Building { Code = "C", Name = "Tòa C" }
                );
                await db.SaveChangesAsync();
            }

            // ====================== SEED ROOMS ======================
            if (!db.Rooms.Any())
            {
                var buildings = db.Buildings.ToList();
                var rooms = new List<Room>();

                foreach (var b in buildings)
                {
                    for (int i = 1; i <= 10; i++)
                    {
                        rooms.Add(new Room
                        {
                            RoomNumber = $"{b.Code}{i:00}",
                            Capacity = 6,
                            CurrentOccupancy = 0,
                            Status = "empty",
                            BuildingId = b.Id
                        });
                    }
                }

                db.Rooms.AddRange(rooms);
                await db.SaveChangesAsync();
            }

            // ====================== SEED STUDENTS ======================
            if (!db.Students.Any())
            {
                var rnd = new Random();
                var students = new List<Student>();

                string[] ho = { "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Võ", "Đặng", "Bùi" };
                string[] tenLot = { "Văn", "Thị", "Hữu", "Phúc", "Minh", "Gia", "Quốc", "Anh", "Duy" };
                string[] ten = { "Nam", "Huy", "Khoa", "Tuấn", "Khánh", "Hạnh", "Trang", "My", "Nhi", "Vy" };

                for (int i = 1; i <= 100; i++)
                {
                    students.Add(new Student
                    {
                        StudentId = $"SV{i:0000}",
                        FullName = $"{ho[rnd.Next(ho.Length)]} {tenLot[rnd.Next(tenLot.Length)]} {ten[rnd.Next(ten.Length)]}",
                        DateOfBirth = DateTime.Now.AddYears(-rnd.Next(18, 23)),
                        Gender = (i % 2 == 0) ? "Nam" : "Nữ",
                        Phone = $"09{rnd.Next(10000000, 99999999)}",
                        Email = $"sv{i:0000}@student.com",
                        ClassName = $"CNTT{rnd.Next(1, 4)}",
                        Faculty = "Công Nghệ Thông Tin",
                        IdCard = $"{rnd.Next(100000000, 999999999)}",
                        Address = "TP. Hồ Chí Minh",
                        Status = "active"
                    });
                }

                db.Students.AddRange(students);
                await db.SaveChangesAsync();
            }

            // ====================== SEED USERS (QUAN TRỌNG – ĐÃ FIX) ======================
            if (!db.Users.Any())
            {
                var users = new List<User>();

                for (int i = 1; i <= 100; i++)
                {
                    users.Add(new User
                    {
                        Username = $"sv{i:000}",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                        Role = "user",
                        SinhVienId = i
                    });
                }

                // Admin
                users.Add(new User
                {
                    Username = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "admin",
                    SinhVienId = null
                });

                db.Users.AddRange(users);
                await db.SaveChangesAsync();
            }
        }
    }
}
