using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class LeadRepository : ILeadRepository
    {
        private readonly ErpSystemContext _dbContext;

        public LeadRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddLeadAsync(Lead lead)
        {
            try
            {
                _dbContext.Leads.Add(lead);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteLeadAsync(int leadId)
        {
            try
            {
                var lead = await _dbContext.Leads.FindAsync(leadId);

                if (lead != null)
                {
                    _dbContext.Leads.Remove(lead);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<Lead>> GetAllLeadsAsync()
        {
            try
            {
                var leads = await _dbContext.Leads
                    .Include(m => m.Meetings)
                    .ToListAsync();
                return leads;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Lead> GetLeadByIdAsync(int leadId)
        {
            try
            {
                var lead = await _dbContext.Leads
                    .Where(l => l.LeadId == leadId)
                    .FirstOrDefaultAsync();

                return lead;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateLeadAsync(int leadId, Lead lead)
        {
            try
            {
                var existLead = await _dbContext.Leads.FindAsync(leadId);

                if (existLead != null)
                {
                    _dbContext.Entry(existLead).CurrentValues.SetValues(lead);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
