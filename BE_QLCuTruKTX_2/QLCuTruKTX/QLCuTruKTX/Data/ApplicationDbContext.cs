using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Models;

namespace QLCuTruKTX.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // ====== DB SETS ======
        public DbSet<User> Users => Set<User>();
        public DbSet<Student> Students => Set<Student>();
        public DbSet<Room> Rooms => Set<Room>();
        public DbSet<Building> Buildings => Set<Building>();
        public DbSet<Tenancy> Tenancies => Set<Tenancy>();
        public DbSet<Form> Forms => Set<Form>();
        public DbSet<MaintenanceRequest> MaintenanceRequests => Set<MaintenanceRequest>();
        public DbSet<RoommateRequest> RoommateRequests => Set<RoommateRequest>();
        public DbSet<SupportSession> SupportSessions => Set<SupportSession>();
        public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
        public DbSet<News> News => Set<News>();

        // 🔥 QUAN TRỌNG: Phải có dòng này mới chạy được chức năng điểm danh
        public DbSet<Attendance> Attendances => Set<Attendance>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ... (Giữ nguyên các cấu hình Relationship và Seed Data của bạn ở đây) ...
            // Bạn có thể copy lại phần cấu hình builder cũ vào đây nếu muốn giữ lại seed data
            // Để ngắn gọn mình không paste lại đoạn seed data dài dòng cũ

            // Cấu hình Relationship (Rút gọn để bạn dễ nhìn, hãy giữ nguyên code cũ của bạn phần này)
            builder.Entity<Building>().HasMany(b => b.Rooms).WithOne(r => r.Building!).HasForeignKey(r => r.BuildingId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Tenancy>().HasOne(t => t.Student).WithMany(s => s.Tenancies).HasForeignKey(t => t.StudentId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Tenancy>().HasOne(t => t.Room).WithMany(r => r.Tenancies).HasForeignKey(t => t.RoomId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<MaintenanceRequest>().HasOne(m => m.Student).WithMany().HasForeignKey(m => m.SinhVienId).OnDelete(DeleteBehavior.SetNull);
            builder.Entity<MaintenanceRequest>().HasOne(m => m.Room).WithMany().HasForeignKey(m => m.RoomId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<RoommateRequest>().HasOne(r => r.Student).WithMany().HasForeignKey(r => r.SinhVienId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}