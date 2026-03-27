export function logout(navigate: (path: string) => void) {
  localStorage.removeItem("auth");
  navigate("/auth/login");
}
