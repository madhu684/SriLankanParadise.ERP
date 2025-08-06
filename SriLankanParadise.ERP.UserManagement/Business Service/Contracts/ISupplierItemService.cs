using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISupplierItemService
    {
        Task Create(SupplierItem supplierItem);
        Task<SupplierItem> GetById(int id);
        Task<IEnumerable<SupplierItem>> GetItemsBySupplierId(int supplierId);
    }
}
