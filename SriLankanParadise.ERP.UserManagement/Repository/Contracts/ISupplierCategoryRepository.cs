using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISupplierCategoryRepository
    {
        Task AddSupplierCategory(SupplierCategory supplierCategory);

        Task<SupplierCategory> GetSupplierCategoryBySupplierCategoryId(int supplierCategoryId);

        Task DeleteSupplierCategory(int supplierCategoryId);
    }
}
