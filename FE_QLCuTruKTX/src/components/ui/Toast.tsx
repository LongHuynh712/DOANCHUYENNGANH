import { useEffect } from "react";

export default function Toast({ message, type, onClose }: any) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        fixed top-5 right-5 px-5 py-3 rounded-xl text-white 
        backdrop-blur-xl border 
        shadow-[0_0_25px_rgba(147,51,234,0.6)]
        animate-slideLeft 
        ${type === "success" ? "bg-green-500/30 border-green-400/40" : ""}
        ${type === "error" ? "bg-red-500/30 border-red-400/40" : ""}
      `}
    >
      {message}
    </div>
  );
}
