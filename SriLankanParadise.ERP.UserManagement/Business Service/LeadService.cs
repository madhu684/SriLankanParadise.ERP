using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class LeadService : ILeadService
    {
        private readonly ILeadRepository _leadRepository;

        public LeadService(ILeadRepository leadRepository)
        {
            _leadRepository = leadRepository;
        }
        public async Task AddLeadAsync(Lead lead)
        {
            await _leadRepository.AddLeadAsync(lead);
        }

        public async Task DeleteLeadAsync(int leadId)
        {
            await _leadRepository.DeleteLeadAsync(leadId);
        }

        public Task<IEnumerable<Lead>> GetAllLeadsAsync()
        {
            return _leadRepository.GetAllLeadsAsync();
        }

        public Task<Lead> GetLeadByIdAsync(int leadId)
        {
            return _leadRepository.GetLeadByIdAsync(leadId);
        }

        public async Task UpdateLeadAsync(int leadId, Lead lead)
        {
            await _leadRepository.UpdateLeadAsync(leadId, lead);
        }
    }
}