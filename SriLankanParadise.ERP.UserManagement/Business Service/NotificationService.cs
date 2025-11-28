using Microsoft.AspNetCore.SignalR;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.Hubs;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IUserConnectionService _userConnectionService;

        public NotificationService(IHubContext<NotificationHub> hubContext, IUserConnectionService userConnectionService)
        {
           _hubContext = hubContext;
           _userConnectionService = userConnectionService;
        }

        public async Task SendNotificationToAllLoggedUsers(NotificationDto notification)
        {
            var connections = await _userConnectionService.GetAllLoggedUserConnections();

            if (connections.Any())
            {
                await _hubContext.Clients.Clients(connections)
                    .SendAsync("ReceiveNotification", notification);
            }
        }

        public async Task SendNotificationToUser(string userId, NotificationDto notification)
        {
            var connections = _userConnectionService.GetUserConnections(userId);
            
            if (connections.Any())
            {
                await _hubContext.Clients.Clients(connections)
                    .SendAsync("ReceiveNotification", notification);
            }
        }
    }
}
