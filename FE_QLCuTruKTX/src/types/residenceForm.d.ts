export interface ResidenceForm {
  id?: number;          // backend trả về
  sinhVienId: number;
  noiDung: string;

  // các field backend tự sinh – FE không gửi
  trangThai?: string;   
  ngayTao?: string;
}
