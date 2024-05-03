using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SupplierAttachmentRepository : ISupplierAttachmentRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SupplierAttachmentRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task AddSupplierAttachment(SupplierAttachment supplierAttachment)
        {
            try
            {
                _dbContext.SupplierAttachments.Add(supplierAttachment);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<SupplierAttachment> GetSupplierAttachmentBySupplierAttachmentId(int supplierAttachmentId)
        {
            try
            {
                var supplierAttachment = await _dbContext.SupplierAttachments
                    .Where(sa => sa.SupplierAttachmentId == supplierAttachmentId)
                    .FirstOrDefaultAsync();

                return supplierAttachment;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task DeleteSupplierAttachment(int supplierAttachmentId)
        {
            try
            {
                var supplierAttachment = await _dbContext.SupplierAttachments.FindAsync(supplierAttachmentId);

                if (supplierAttachment != null)
                {
                    _dbContext.SupplierAttachments.Remove(supplierAttachment);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<string> GetSupplierAttachmentPathAsync(int supplierAttachmentId)
        {
            
            var supplierAttachment = await _dbContext.SupplierAttachments.FindAsync(supplierAttachmentId);
            if (supplierAttachment != null && supplierAttachment.Status == 1)
            {
                return supplierAttachment.AttachmentPath;
            }
            else
            {
                return null; // Return null if the attachment does not meet the condition
            }
        }

        public async Task UpdateSupplierAttachment(int supplierAttachmentId, SupplierAttachment supplierAttachment)
        {
            try
            {
                var existsSupplierAttachment = await _dbContext.SupplierAttachments.FindAsync(supplierAttachmentId);

                if (existsSupplierAttachment != null)
                {
                    _dbContext.Entry(existsSupplierAttachment).CurrentValues.SetValues(supplierAttachment);
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
