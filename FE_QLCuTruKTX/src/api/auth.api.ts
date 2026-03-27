import axios from "axios";
import { LoginResponse } from "../contexts/AuthContext";

const API_URL = "https://localhost:7122/api/Auth";

export async function loginApi(data: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await axios.post<LoginResponse>(`${API_URL}/login`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
