using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SupplyReturnMasterRepository : ISupplyReturnMasterRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SupplyReturnMasterRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddSupplyReturnMaster(SupplyReturnMaster supplyReturnMaster)
        {
            try
            {
                _dbContext.SupplyReturnMasters.Add(supplyReturnMaster);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task ApproveSupplyReturnMaster(int supplyReturnMasterId, SupplyReturnMaster supplyReturnMaster)
        {
            try
            {
                var existingSupplyReturnMaster = await _dbContext.SupplyReturnMasters.FindAsync(supplyReturnMasterId);

                if (existingSupplyReturnMaster != null) 
                {
                    existingSupplyReturnMaster.Status = supplyReturnMaster.Status;
                    existingSupplyReturnMaster.ApprovedBy = supplyReturnMaster.ApprovedBy;
                    existingSupplyReturnMaster.ApprovedUserId = supplyReturnMaster.ApprovedUserId;
                    existingSupplyReturnMaster.ApprovedDate = supplyReturnMaster.ApprovedDate;

                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SupplyReturnMaster>> GetAll()
        {
            try
            {
                var master = await _dbContext.SupplyReturnMasters
                    .Include(s => s.Supplier)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.ItemMaster)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.Batch)
                    .ToListAsync();

                return master.Any() ? master : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SupplyReturnMaster>> GetApprovedSupplyReturnMasterByCompanyId(int companyId)
        {
            try
            {
                var master = await _dbContext.SupplyReturnMasters.Where(s => s.CompanyId == companyId && s.Status == 2)
                    .Include(s => s.Supplier)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.ItemMaster)
                            .ThenInclude(si => si.Unit)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.Batch)
                    .ToListAsync();

                return master.Any() ? master : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SupplyReturnMaster>> GetSupplyReturnMasterByCompanyId(int companyId)
        {
            try
            {
                var master = await _dbContext.SupplyReturnMasters.Where(s => s.CompanyId == companyId)
                    .Include(s => s.Supplier)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.ItemMaster)
                            .ThenInclude(si => si.Unit)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.Batch)
                    .ToListAsync();

                return master.Any() ? master : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<SupplyReturnMaster> GetSupplyReturnMasterBySupplyReturnMasterId(int supplyReturnMasterId)
        {
            try
            {
                var master = await _dbContext.SupplyReturnMasters.Where(s => s.SupplyReturnMasterId == supplyReturnMasterId)
                    .Include(s => s.Supplier)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.ItemMaster)
                            .ThenInclude(si => si.Unit)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.Batch)
                    .FirstOrDefaultAsync();

                return master;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SupplyReturnMaster>> GetSupplyReturnMasterByUserId(int userId)
        {
            try
            {
                var master = await _dbContext.SupplyReturnMasters.Where(s => s.ReturnedUserId == userId)
                    .Include(s => s.Supplier)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.ItemMaster)
                    .Include(s => s.SupplyReturnDetails)
                        .ThenInclude(sd => sd.Batch)
                    .ToListAsync();

                return master.Any() ? master : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSupplyReturnMaster(int supplyReturnMasterId, SupplyReturnMaster supplyReturnMaster)
        {
            try
            {
                var existingSupplyReturnMaster = await _dbContext.SupplyReturnMasters.FindAsync(supplyReturnMasterId);

                if (existingSupplyReturnMaster != null)
                {
                    _dbContext.Entry(existingSupplyReturnMaster).CurrentValues.SetValues(supplyReturnMaster);
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
