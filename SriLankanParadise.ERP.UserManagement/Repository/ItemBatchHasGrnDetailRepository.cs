using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class ItemBatchHasGrnDetailRepository : IItemBatchHasGrnDetailRepository
    {
        private readonly ErpSystemContext _dbContext;

        public ItemBatchHasGrnDetailRepository(ErpSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task AddItemBatchHasGrnDetail(ItemBatchHasGrnDetail itemBatchHasGrnDetail)
        {
            try
            {
                _dbContext.ItemBatchHasGrnDetails.Add(itemBatchHasGrnDetail);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
