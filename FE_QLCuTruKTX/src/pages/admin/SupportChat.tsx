import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import axiosClient from "../../api";
import { Send, User, Search, MessageSquare } from "lucide-react";

interface Message {
  senderId?: number;
  senderName: string;
  message: string;
  timestamp: string;
  isMine?: boolean;
}

interface ChatUser {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
}

export default function AdminSupportChat() {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeUsers, setActiveUsers] = useState<ChatUser[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const adminUsername = "admin"; 

  useEffect(() => {
    // 1. Lấy lịch sử chat
    axiosClient.get<Message[]>("/chat/history")
      .then(res => {
        const history = res.data;
        setMessages(history);

        // Lọc danh sách người dùng đã nhắn tin (loại bỏ admin ra khỏi list bên trái)
        const uniqueUsers = new Map<number, ChatUser>();
        history.forEach(m => {
            if (m.senderName !== adminUsername && m.senderId) {
                if(!uniqueUsers.has(m.senderId)) {
                    uniqueUsers.set(m.senderId, {
                        id: m.senderId,
                        name: m.senderName,
                        lastMessage: m.message,
                        time: m.timestamp
                    });
                }
            }
        });
        setActiveUsers(Array.from(uniqueUsers.values()));
      })
      .catch(err => console.error("Lỗi tải lịch sử chat:", err));

    // 2. Kết nối SignalR (HTTP Cổng 5000)
    const token = localStorage.getItem("token") || "";
    if (!token) return;

    const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/hubs/chat", { // 🔥 Đã đổi sang HTTP
             accessTokenFactory: () => token 
        })
        .withAutomaticReconnect()
        .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
            console.log("✅ Admin Connected SignalR (HTTP 5000)");
            connection.on("ReceiveMessage", (userId, userName, message, timestamp) => {
               const isMine = userName === adminUsername;
               setMessages(prev => [...prev, { senderId: userId, senderName: userName, message, timestamp, isMine }]);

               // Nếu có tin nhắn mới từ Sinh viên -> Đẩy lên đầu danh sách
               if (!isMine) {
                   setActiveUsers(prev => {
                       const others = prev.filter(u => u.id !== userId);
                       return [{ id: userId, name: userName, lastMessage: message, time: timestamp }, ...others];
                   });
               }
            });
        })
        .catch(err => console.error("❌ Lỗi kết nối SignalR:", err));
    }
  }, [connection]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUserId]);

  const handleSend = async () => {
    if (!input.trim() || !connection || !selectedUserId) return;
    try {
        // Gửi tin nhắn riêng cho User đang chọn
        await connection.invoke("SendMessage", selectedUserId.toString(), input);
        setInput("");
    } catch (e) {
        console.error("Lỗi gửi tin nhắn:", e);
    }
  };

  // Lọc tin nhắn hiển thị theo User đang chọn
  const filteredMessages = messages.filter(m => m.senderId === selectedUserId || (m.isMine && m.senderId === selectedUserId) || (m.isMine && !m.senderId)); 
  // Lưu ý: Logic lọc tin nhắn của Admin cần linh hoạt vì Admin gửi đi có thể không lưu receiverId trong state messages local ngay lập tức nếu không trả về từ server chuẩn.
  // Tuy nhiên với logic hiện tại server trả về ReceiveMessage cho tất cả, nên lọc theo senderId hoặc receiverId là ổn.
  // Ở đây mình lọc đơn giản: Tin của User đó HOẶC Tin của Admin (isMine) gửi trong phiên này.
  
  // Cải thiện bộ lọc để chính xác hơn với data thực tế:
  const displayMessages = messages.filter(m => {
      // 1. Tin nhắn do User này gửi đến
      if (m.senderId === selectedUserId) return true;
      // 2. Tin nhắn do Admin gửi (isMine) nhưng Receiver phải là User này (cần Backend trả về ReceiverId để chính xác tuyệt đối, nhưng tạm thời hiển thị tất cả tin của Admin khi đang chat với user này để admin dễ theo dõi)
      if (m.isMine) return true; 
      return false;
  });

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#1e293b] rounded-2xl border border-white/10 overflow-hidden text-white font-sans">
      
      {/* CỘT TRÁI: DANH SÁCH USER */}
      <div className="w-80 border-r border-white/10 bg-[#0f172a] flex flex-col">
        <div className="p-4 border-b border-white/10">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><MessageSquare className="text-blue-400"/> Tin nhắn đến</h2>
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={16}/>
                <input className="w-full bg-[#1e293b] rounded-lg py-2 pl-9 pr-4 text-sm text-white outline-none" placeholder="Tìm sinh viên..." />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {activeUsers.map(u => (
                <div key={u.id} onClick={() => setSelectedUserId(u.id)} className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 ${selectedUserId === u.id ? 'bg-blue-600/10 border-l-4 border-blue-500' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white">{u.name.charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-sm truncate text-gray-200">{u.name}</h4>
                            <span className="text-[10px] text-gray-500">{new Date(u.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{u.lastMessage}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* CỘT PHẢI: NỘI DUNG CHAT */}
      <div className="flex-1 flex flex-col bg-[#1e293b]">
        {selectedUserId ? (
            <>
                <div className="p-4 border-b border-white/10 bg-[#0f172a]/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center"><User /></div>
                    <div>
                        <h3 className="font-bold">Sinh viên #{selectedUserId}</h3>
                        <p className="text-xs text-green-400 flex items-center gap-1">● Online</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {displayMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                            {!msg.isMine && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs mr-2 mt-1">{msg.senderName.charAt(0)}</div>}
                            <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#334155] text-white rounded-bl-none'}`}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-white/10 bg-[#0f172a] flex gap-3">
                    <input className="flex-1 bg-[#334155] border-none rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-blue-500" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Nhập câu trả lời..." />
                    <button onClick={handleSend} className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition"><Send size={20}/></button>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <MessageSquare size={64} className="mb-4 opacity-20"/>
                <p>Chọn một sinh viên từ danh sách để bắt đầu hỗ trợ</p>
            </div>
        )}
      </div>
    </div>
  );
}