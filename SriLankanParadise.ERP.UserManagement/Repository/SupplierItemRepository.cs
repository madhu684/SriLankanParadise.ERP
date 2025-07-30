using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SupplierItemRepository : ISupplierItemRepository
    {
        private readonly ErpSystemContext _dbContext;

        public SupplierItemRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Create(SupplierItem supplierItem)
        {
            try
            {
                _dbContext.SupplierItems.Add(supplierItem);
                await _dbContext.SaveChangesAsync();
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<SupplierItem> GetById(int id)
        {
            try
            {
                var supplier = await _dbContext.SupplierItems.FirstOrDefaultAsync(x => x.Id == id);

                return supplier ?? null!;
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SupplierItem>> GetItemsBySupplierId(int supplierId)
        {
            try
            {
                var supplierItems = await _dbContext.SupplierItems
                                        .Where(si => si.SupplierId == supplierId)
                                        //.Include(si => si.Supplier)
                                        .Include(si => si.ItemMaster)
                                        .ToListAsync();

                return supplierItems.Any() ? supplierItems : null!;
            }
            catch(Exception)
            {
                throw;
            }
        }
    }
}
