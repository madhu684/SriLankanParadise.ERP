using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class PackingSlipRepository : IPackingSlipRepository
    {
        private readonly ErpSystemContext _dbContext;

        public PackingSlipRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddPackingSlip(PackingSlip packingSlip)
        {
            try
            {
                _dbContext.PackingSlips.Add(packingSlip);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task ApprovePackingSlip(int packingSlipId, PackingSlip packingSlip)
        {
            try
            {
                var existPackingSlip = await _dbContext.PackingSlips.FindAsync(packingSlipId);

                if (existPackingSlip != null)
                {
                    existPackingSlip.Status = packingSlip.Status;
                    existPackingSlip.ApprovedBy = packingSlip.ApprovedBy;
                    existPackingSlip.ApprovedUserId = packingSlip.ApprovedUserId;
                    existPackingSlip.ApprovedDate = packingSlip.ApprovedDate;

                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<PackingSlip>> GetAll()
        {
            try
            {
                var packingSlips = await _dbContext.PackingSlips
                    .Include(ps => ps.PackingSlipDetails)
                    .ThenInclude(psd => psd.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                    .Include(ps => ps.PackingSlipDetails)
                    .ThenInclude(psd => psd.ItemBatch)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(ps => ps.Customer)
                    .ToListAsync();

                return packingSlips.Any() ? packingSlips : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<PackingSlip> GetPackingSlipByPackingSlipId(int packingSlipId)
        {
            try
            {
                var packingSlip = await _dbContext.PackingSlips
                    .Where(ps => ps.PackingSlipId == packingSlipId)
                    .Include(ps => ps.PackingSlipDetails)
                    .ThenInclude(psd => psd.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                    .Include(ps => ps.PackingSlipDetails)
                    .ThenInclude(psd => psd.ItemBatch)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(ps => ps.Customer)
                    .FirstOrDefaultAsync();

                return packingSlip;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<PackingSlip>> GetPackingSlipsByUserId(int userId)
        {
            try
            {
                var packingSlips = await _dbContext.PackingSlips
                    .Where(ps => ps.CreatedUserId == userId)
                    .Include(ps => ps.PackingSlipDetails)
                    .ThenInclude(psd => psd.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                    .Include(ps => ps.PackingSlipDetails)
                    .ThenInclude(psd => psd.ItemBatch)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(ps => ps.Customer)
                    .ToListAsync();


                return packingSlips.Any() ? packingSlips : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<PackingSlip>> GetPackingSlipsWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var packingSlips = await _dbContext.PackingSlips
                    .Where(ps => ps.Status != 0 && ps.CompanyId == companyId)
                    .Include(so => so.PackingSlipDetails)
                    .ThenInclude(psd => psd.ItemBatch)
                    .ThenInclude(ib => ib.Batch)
                    .Include(ps => ps.PackingSlipDetails)
                    .ThenInclude(sod => sod.ItemBatch)
                    .ThenInclude(ib => ib.ItemMaster)
                    .ThenInclude(im => im.Unit)
                    .Include(ps => ps.Customer)
                    .ToListAsync();

                return packingSlips.Any() ? packingSlips : null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdatePackingSlip(int packingSlipId, PackingSlip packingSlip)
        {
            try
            {
                var existPackingSlip = await _dbContext.PackingSlips.FindAsync(packingSlipId);

                if (existPackingSlip != null)
                {
                    _dbContext.Entry(existPackingSlip).CurrentValues.SetValues(packingSlip);
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