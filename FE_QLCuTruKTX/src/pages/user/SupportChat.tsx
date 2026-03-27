import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import axiosClient from "../../api";
import { MessageCircle, X, Send, User } from "lucide-react";

interface Message {
  senderId?: number;
  senderName: string;
  message: string;
  timestamp: string;
  isMine?: boolean;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔥 HÀM GIẢI MÃ TOKEN ĐỂ LẤY USERNAME CHÍNH XÁC
  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] 
            || payload["unique_name"] 
            || payload["sub"] 
            || "";
    } catch (e) {
        return "";
    }
  };

  const currentUsername = getUsernameFromToken();

  useEffect(() => {
    if (isOpen && !connection) {
      // 1. Load lịch sử chat cũ
      axiosClient.get<Message[]>("/chat/history")
        .then(res => setMessages(res.data))
        .catch(err => console.error("Lỗi tải lịch sử:", err));

      // 2. Kết nối SignalR (HTTP Cổng 5000)
      const token = localStorage.getItem("token") || "";
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/hubs/chat", { // 🔥 Đã đổi sang HTTP
             accessTokenFactory: () => token 
        })
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    }
  }, [isOpen]);

  useEffect(() => {
    if (connection) {
      connection.start().then(() => {
        console.log("✅ User Connected SignalR (HTTP 5000)");
        
        connection.on("ReceiveMessage", (userId, userName, message, timestamp) => {
           // So sánh tên người gửi với tên trong token của mình
           const isMine = userName.trim().toLowerCase() === currentUsername.trim().toLowerCase();
           setMessages(prev => [...prev, { senderId: userId, senderName: userName, message, timestamp, isMine }]);
        });
      })
      .catch(err => console.error("❌ Lỗi kết nối SignalR:", err));
    }
  }, [connection]);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !connection) return;
    try {
      await connection.invoke("SendMessage", "0", input); // "0" là gửi cho Admin/Chat chung
      setInput("");
    } catch (e) { console.error(e); }
  };

  // --- GIAO DIỆN ---
  if (!isOpen) return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-110 text-white rounded-full shadow-2xl transition-all z-50 animate-bounce">
        <MessageCircle size={28} />
      </button>
  );

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 font-sans">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full"><User size={20} className="text-white"/></div>
            <div>
                <h3 className="font-bold text-white text-sm">Hỗ trợ sinh viên</h3>
                <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span><span className="text-[10px] text-blue-100">Trực tuyến</span></div>
            </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:bg-white/10 p-1 rounded"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f172a]">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"}`}>
            {!msg.isMine && <span className="text-[10px] text-gray-500 ml-2 mb-1">{msg.senderName}</span>}
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.isMine ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-700 text-gray-200 rounded-bl-sm"}`}>
              {msg.message}
            </div>
            <span className="text-[9px] text-gray-600 mt-1 mx-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[#1e293b] border-t border-white/10 flex gap-2">
        <input className="flex-1 bg-black/20 border border-slate-600 rounded-full px-4 py-2 text-sm text-white outline-none" placeholder="Nhập thắc mắc..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} />
        <button onClick={handleSend} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition shadow-lg"><Send size={18} /></button>
      </div>
    </div>
  );
}