namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IUserConnectionService
    {
        Task AddConnection(string userId, string connectionId);
        Task RemoveConnection(string connectionId);
        List<string> GetUserConnections(string userId);
        Task<List<string>> GetAllLoggedUserConnections();
    }
}
