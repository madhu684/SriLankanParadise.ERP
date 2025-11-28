using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface INotificationService
    {
        Task SendNotificationToAllLoggedUsers(NotificationDto notification);
        Task SendNotificationToUser(string userId, NotificationDto notification);
    }
}
