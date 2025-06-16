using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class EmptyReturnRepository : IEmptyReturnRepository
    {
        private readonly ErpSystemContext _dbContext;
        private readonly IMapper _mapper;

        public EmptyReturnRepository(ErpSystemContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<EmptyReturnMaster> AddEmptyReturnAsync(EmptyReturnMaster master)
        {
            var strategy = _dbContext.Database.CreateExecutionStrategy();

            await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _dbContext.Database.BeginTransactionAsync();

                try
                {
                    // Save master and get ID
                    await _dbContext.EmptyReturnMasters.AddAsync(master);
                    await _dbContext.SaveChangesAsync();

                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    var inner = ex.InnerException?.Message ?? ex.Message;
                    throw new Exception($"Transaction failed: {inner}", ex);
                }
            });
            return master;
        }

        public async Task<IEnumerable<EmptyReturnMaster>> GetEmptyReturnsByCompanyAsync(int companyId)
        {
            try
            {
                var result = await _dbContext.EmptyReturnMasters
                    .Where(m => m.CompanyId == companyId)
                    .Include(m => m.EmptyReturnDetails)
                    .ToListAsync();

                return result.Any() ? result : null;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<EmptyReturnMaster> GetEmptyReturnMasterById(int id)
        {
            return await _dbContext.EmptyReturnMasters
                .Include(m => m.EmptyReturnDetails)
                .FirstOrDefaultAsync(m => m.EmptyReturnMasterId == id);
        }

        public async Task UpdateEmptyReturnMasterAndDetails(EmptyReturnMaster updatedMaster)
        {
            var existingMaster = await _dbContext.EmptyReturnMasters
                .Include(m => m.EmptyReturnDetails)
                .FirstOrDefaultAsync(m => m.EmptyReturnMasterId == updatedMaster.EmptyReturnMasterId);

            if (existingMaster != null)
            {
                // Preserve important fields
                updatedMaster.ReferenceNo = existingMaster.ReferenceNo;
                updatedMaster.CreatedBy = existingMaster.CreatedBy;
                updatedMaster.CreateDate = existingMaster.CreateDate;
                updatedMaster.ModifyDate = DateTime.UtcNow;
                updatedMaster.ApprovedBy = existingMaster.ApprovedBy;
                updatedMaster.ApprovedDate = existingMaster.ApprovedDate;
                updatedMaster.ApprovedUserId = existingMaster.ApprovedUserId;

                // Update master values (excluding navigation properties)
                _dbContext.Entry(existingMaster).CurrentValues.SetValues(updatedMaster);

                // Remove all existing details
                _dbContext.EmptyReturnDetails.RemoveRange(existingMaster.EmptyReturnDetails);

                // Re-attach updated details with correct master id
                foreach (var newDetail in updatedMaster.EmptyReturnDetails)
                {
                    newDetail.EmptyReturnDetailId = 0; // Reset EF identity if needed
                    newDetail.EmptyReturnMasterId = existingMaster.EmptyReturnMasterId;
                    _dbContext.EmptyReturnDetails.Add(newDetail);
                }

                await _dbContext.SaveChangesAsync();
            }
        }
        public async Task<bool> ApproveEmptyReturnMaster(int emptyReturnMasterId, ApproveEmptyReturnRequestModel request)
        {
            var master = await _dbContext.EmptyReturnMasters
                .FirstOrDefaultAsync(m => m.EmptyReturnMasterId == emptyReturnMasterId);

            if (master == null)
                return false;

            master.Status = request.Status;
            master.ApprovedBy = request.ApprovedBy;
            master.ApprovedUserId = request.ApprovedUserId;
            master.ApprovedDate = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return true;
        }




    }
}
