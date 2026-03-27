using Microsoft.AspNetCore.SignalR;

namespace QLCuTruKTX.Hubs
{
    public class DashboardHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "dashboard");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? ex)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "dashboard");
            await base.OnDisconnectedAsync(ex);
        }
    }
}
