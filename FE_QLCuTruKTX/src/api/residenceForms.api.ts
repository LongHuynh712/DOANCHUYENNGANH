import axios from "axios";
import { ResidenceForm } from "../types/residenceForm";

const API_URL = "https://localhost:7122/api/forms";

export const formsApi = {
  // Lấy đơn theo svId
  getByStudent: (svId: number) =>
    axios.get<ResidenceForm[]>(`${API_URL}/my/${svId}`),

  // Tạo đơn mới
  create: (data: ResidenceForm) =>
    axios.post(API_URL, data),
};

export default formsApi;
