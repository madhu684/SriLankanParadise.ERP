using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISupplierCategoryService
    {
        Task AddSupplierCategory(SupplierCategory supplierCategory);

        Task<SupplierCategory> GetSupplierCategoryBySupplierCategoryId(int supplierCategoryId);

        Task DeleteSupplierCategory(int supplierCategoryId);
    }
}
