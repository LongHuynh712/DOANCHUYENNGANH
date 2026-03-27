import { apiGet } from "./index";

export interface DashboardStats {
  students: number;
  rooms: number;
  maintenancePending: number;
  roommatePending: number;
  formsPending: number;
}

export const getDashboardStats = () =>
  apiGet("/dashboard/stats") as Promise<DashboardStats>;
