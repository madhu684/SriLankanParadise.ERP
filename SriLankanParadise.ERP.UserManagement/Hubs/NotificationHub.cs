using Microsoft.AspNetCore.SignalR;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly IUserConnectionService _userConnectionService;

        public NotificationHub(IUserConnectionService userConnectionService)
        {
            _userConnectionService = userConnectionService;
        }

        public async Task RegisterUser(int userId)
        {
            var userIdStr = userId.ToString();

            // Store the connection mapping
            await _userConnectionService.AddConnection(userIdStr, Context.ConnectionId);
            await Clients.Caller.SendAsync("Registered", "Successfully registered for notifications");
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // Remove the connection mapping
            await _userConnectionService.RemoveConnection(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
