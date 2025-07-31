using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISupplierItemRepository
    {
        Task Create(SupplierItem supplierItem);
        Task<SupplierItem> GetById(int id);
        Task<IEnumerable<SupplierItem>> GetItemsBySupplierId(int supplierId);
        Task Update(int itemMasterId, SupplierItem supplierItem);
        Task Delete(int itemMasterId);
    }
}
