using Microsoft.AspNetCore.SignalR;

namespace QLCuTruKTX.Hubs
{
    public class RoommateRequestHub : Hub
    {
        /// <summary>
        /// FE gọi Join để theo dõi yêu cầu của chính sinh viên
        /// </summary>
        public async Task JoinStudentGroup(int sinhVienId)
        {
            string groupName = $"student_{sinhVienId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        /// <summary>
        /// Admin theo dõi tất cả yêu cầu mới
        /// </summary>
        public async Task JoinAdminGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "admins");
        }

        /// <summary>
        /// System broadcast (optional)
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        /// <summary>
        /// System broadcast (optional)
        /// </summary>
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }


        // ====================== SYSTEM SEND METHODS ======================
        // Những method này sẽ được Controller gọi để đẩy sự kiện real-time


        /// <summary>
        /// Gửi thông báo khi có yêu cầu mới
        /// </summary>
        public async Task NotifyNewRequest(object dto)
        {
            await Clients.Group("admins").SendAsync("NewRoommateRequest", dto);
        }

        /// <summary>
        /// Gửi thông báo khi yêu cầu được cập nhật (approve / reject)
        /// </summary>
        public async Task NotifyUpdateRequest(int sinhVienId, object dto)
        {
            string group = $"student_{sinhVienId}";

            await Clients.Group(group).SendAsync("RoommateRequestUpdated", dto);

            // Admin cũng nhận cập nhật
            await Clients.Group("admins").SendAsync("RoommateRequestUpdated", dto);
        }

        /// <summary>
        /// Gửi thông báo khi yêu cầu bị xóa
        /// </summary>
        public async Task NotifyDeleteRequest(int sinhVienId, int requestId)
        {
            string group = $"student_{sinhVienId}";

            await Clients.Group(group).SendAsync("RoommateRequestDeleted", requestId);

            // Admin cũng nhận
            await Clients.Group("admins").SendAsync("RoommateRequestDeleted", requestId);
        }
    }
}
