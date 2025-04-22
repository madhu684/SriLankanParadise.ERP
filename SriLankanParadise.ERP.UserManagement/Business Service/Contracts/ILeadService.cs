using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ILeadService
    {
        Task<IEnumerable<Lead>> GetAllLeadsAsync();
        Task<Lead> GetLeadByIdAsync(int leadId);
        Task AddLeadAsync(Lead lead);
        Task UpdateLeadAsync(int leadId, Lead lead);
        Task DeleteLeadAsync(int leadId);
    }
}