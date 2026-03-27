export interface Room {
  id: number;
  roomNumber: string;
  capacity: number;
  currentOccupancy: number;
  status: string;     // "empty" | "full" | "available"
  buildingId: number; // Quan trọng: Phải là buildingId (số) để khớp với logic form
  tenancies?: any[];
}