using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ItemPriceDetailRepository : IItemPriceDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ItemPriceDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task AddItemPriceDetail(ItemPriceDetail itemPriceDetail)
        {
            try
            {
                _dbContext.ItemPriceDetails.Add(itemPriceDetail);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ItemPriceDetail> GetById(int id)
        {
            try
            {
                var itemPriceDetail = await _dbContext.ItemPriceDetails
                    .FirstOrDefaultAsync(ipd => ipd.Id == id);

                return itemPriceDetail!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<ItemPriceDetail>> GetByItemPriceMasterId(int itemPriceMasterId)
        {
            try
            {
                var itemPriceDetails = await _dbContext.ItemPriceDetails
                    .Where(ipd => ipd.ItemPriceMasterId == itemPriceMasterId)
                    .ToListAsync();

                return itemPriceDetails.Any() ? itemPriceDetails : null!;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
