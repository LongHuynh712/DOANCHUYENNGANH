namespace QLCuTruKTX.Models
{
    public enum MaintenanceStatus
    {
        Pending = 0,
        InProgress = 1,
        Completed = 2,

        // BẮT BUỘC PHẢI CÓ 2 DÒNG NÀY ĐỂ NÚT BẤM HOẠT ĐỘNG
        Approved = 3,
        Rejected = 4
    }
}