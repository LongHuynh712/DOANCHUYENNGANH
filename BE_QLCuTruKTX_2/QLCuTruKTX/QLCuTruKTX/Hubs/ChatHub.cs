using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using QLCuTruKTX.Data;
using QLCuTruKTX.Models;
using System.Text.RegularExpressions;

namespace QLCuTruKTX.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;
        public ChatHub(ApplicationDbContext db) { _db = db; }

        public async Task SendMessage(string receiverIdStr, string message)
        {
            var senderUsername = Context.User?.Identity?.Name;
            if (senderUsername == null) return;

            var sender = await _db.Users.FirstOrDefaultAsync(u => u.Username == senderUsername);
            if (sender == null) return;

            // 1. Lưu tin nhắn
            var msg = new ChatMessage
            {
                SenderId = sender.Id,
                Message = message,
                Timestamp = DateTime.Now
            };
            if (int.TryParse(receiverIdStr, out int rId) && rId > 0) msg.ReceiverId = rId;

            _db.ChatMessages.Add(msg);
            await _db.SaveChangesAsync();

            // 2. Gửi Realtime
            await Clients.All.SendAsync("ReceiveMessage", sender.Id, sender.Username, message, msg.Timestamp);

            // 3. Auto Reply cho User
            if (sender.Role == "user")
            {
                await CheckAndAutoReply(sender.Id, message);
            }
        }

        private async Task CheckAndAutoReply(int studentId, string userMessage)
        {
            string reply = "";
            string msg = userMessage.ToLower();

            // --- CHỦ ĐỀ 1: CHÀO HỎI ---
            if (Regex.IsMatch(msg, @"\b(hi|hello|xin chào|chào|alo|có ai không)\b"))
                reply = "🤖 [Bot] Chào bạn! Mình là AI hỗ trợ KTX. Bạn có thể hỏi về: Điện nước, Học phí, Giờ giấc, Wifi, Thẻ xe, hoặc Báo hỏng...";

            // --- CHỦ ĐỀ 2: TÀI CHÍNH ---
            else if (Regex.IsMatch(msg, @"\b(học phí|tiền phòng|đóng tiền|thanh toán|nợ)\b"))
                reply = "💰 [Học phí] Tiền phòng thu từ ngày 1-5 hàng tháng. Vui lòng đóng tại P. Tài vụ hoặc chuyển khoản qua App.";

            else if (Regex.IsMatch(msg, @"\b(điện|nước|chỉ số|hóa đơn)\b"))
                reply = "⚡ [Điện nước] Chỉ số chốt ngày 30. Tiền điện: 3.000đ/kwh, Nước: 8.000đ/m3. Hóa đơn sẽ có trên web vào ngày mùng 2.";

            // --- CHỦ ĐỀ 3: CƠ SỞ VẬT CHẤT ---
            else if (Regex.IsMatch(msg, @"\b(hỏng|sửa|bể|vỡ|hư|không sáng|tắc|nghẹt)\b"))
                reply = "🛠 [Báo hỏng] Rất tiếc về sự cố này. Bạn hãy vào mục 'Báo hỏng' trên web để tạo phiếu, thợ sẽ lên sửa trong 24h.";

            else if (Regex.IsMatch(msg, @"\b(mạng|wifi|internet|lag|yếu)\b"))
                reply = "📶 [Internet] Wifi mỗi phòng có pass riêng dán ở cửa. Nếu mạng yếu, hãy thử rút điện modem ra cắm lại nhé.";

            else if (Regex.IsMatch(msg, @"\b(giặt|máy giặt|phơi)\b"))
                reply = "giat [Giặt ủi] Khu giặt sấy nằm ở tầng 1 (cạnh cầu thang). Giá 15k/lần giặt, 20k/lần sấy. Mở cửa 24/7.";

            // --- CHỦ ĐỀ 4: AN NINH & NỘI QUY ---
            else if (Regex.IsMatch(msg, @"\b(giờ|mở cửa|đóng cửa|về khuya)\b"))
                reply = "⏰ [Giờ giấc] KTX mở cửa: 05:00 - 23:00. Sau 23h sẽ khóa cổng chính, nếu về trễ cần gọi bảo vệ và ghi tường trình.";

            else if (Regex.IsMatch(msg, @"\b(khách|bạn|người thân|thăm)\b"))
                reply = "busts_in_silhouette [Tiếp khách] Bạn bè được thăm từ 8h-20h tại phòng sinh hoạt chung. Không được đưa người lạ vào phòng ngủ.";

            else if (Regex.IsMatch(msg, @"\b(thẻ|mất thẻ|làm lại thẻ)\b"))
                reply = "💳 [Thẻ KTX] Nếu mất thẻ, bạn cần lên P. Công tác sinh viên báo ngay để khóa thẻ cũ. Phí làm lại là 50.000đ.";

            else if (Regex.IsMatch(msg, @"\b(xe|gửi xe|nhà xe|vé xe)\b"))
                reply = "🛵 [Nhà xe] Nhà xe nằm dưới tầng hầm B1. Vé tháng 80k/xe máy, 30k/xe đạp. Đăng ký tại bàn bảo vệ.";

            // --- CHỦ ĐỀ 5: KHẨN CẤP ---
            else if (Regex.IsMatch(msg, @"\b(cháy|trộm|mất đồ|cấp cứu|đánh nhau)\b"))
                reply = "🚨 [KHẨN CẤP] Bình tĩnh! Hãy gọi ngay hotline Bảo vệ: 0909.113.113 (trực 24/24) hoặc báo cho Trưởng nhà.";

            // Gửi phản hồi nếu có
            if (!string.IsNullOrEmpty(reply))
            {
                await Task.Delay(1000); // Delay 1 giây cho tự nhiên
                var botUser = await _db.Users.FirstOrDefaultAsync(u => u.Role == "admin");
                if (botUser != null)
                {
                    var botMsg = new ChatMessage { SenderId = botUser.Id, ReceiverId = studentId, Message = reply };
                    _db.ChatMessages.Add(botMsg);
                    await _db.SaveChangesAsync();
                    await Clients.All.SendAsync("ReceiveMessage", botUser.Id, "Hệ thống hỗ trợ", reply, botMsg.Timestamp);
                }
            }
        }
    }
}