using QLCuTruKTX.Models;
using QLCuTruKTX.DTOs;

namespace QLCuTruKTX.Mappings
{
    public static class RoommateRequestMapping
    {
        public static RoommateRequestDto ToDto(this RoommateRequest r)
        {
            return new RoommateRequestDto
            {
                Id = r.Id,
                SinhVienId = r.SinhVienId,

                // tránh null
                HoTen = r.Student?.FullName ?? "",
                MSSV = r.Student?.StudentId ?? "",

                NoiDung = r.NoiDung,
                TrangThai = r.TrangThai,
                NgayTao = r.NgayTao
            };
        }
    }
}
