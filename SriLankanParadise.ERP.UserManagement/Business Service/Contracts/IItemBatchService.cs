using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IItemBatchService
    {
        Task AddItemBatch(ItemBatch itemBatch);

        Task<IEnumerable<ItemBatch>> GetAll();

        Task<IEnumerable<ItemBatch>> GetItemBatchesByCompanyId(int companyId);

        Task<IEnumerable<ItemBatch>> GetItemBatchesByUserId(int userId);
    }
}
