import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function Header() {
  const { dark, setDark } = useContext(ThemeContext);

  const logout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-white/10 bg-slate-900/70 backdrop-blur-md">
      <h1 className="text-lg font-semibold tracking-wide bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
        KTX Manager
      </h1>

      <div className="flex items-center gap-4">
        {/* Toggle theme */}
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
        >
          {dark ? "🌙" : "☀️"}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="px-3 py-1 rounded-lg text-red-400 hover:text-red-300 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
