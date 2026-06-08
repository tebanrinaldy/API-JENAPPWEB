using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Webapi.Hubs
{
    public class NotificationsHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var tenantId = Context.User?.FindFirstValue("tenant_id");

            if (!string.IsNullOrWhiteSpace(tenantId))
                await Groups.AddToGroupAsync(Context.ConnectionId, $"tenant-{tenantId}");

            await base.OnConnectedAsync();
        }
    }
}
