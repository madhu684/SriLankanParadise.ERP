using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SupplierCategoryService : ISupplierCategoryService

    {
    private readonly ISupplierCategoryRepository _supplierCategoryRepository;

    public SupplierCategoryService(ISupplierCategoryRepository supplierCategoryRepository)
    {
            _supplierCategoryRepository = supplierCategoryRepository;
    }

    public async Task AddSupplierCategory(SupplierCategory supplierCategory)
    {
        await _supplierCategoryRepository.AddSupplierCategory(supplierCategory);
    }

    public async Task<SupplierCategory> GetSupplierCategoryBySupplierCategoryId(int supplierCategoryId)
    {
        return await _supplierCategoryRepository.GetSupplierCategoryBySupplierCategoryId(supplierCategoryId);
    }

    public async Task DeleteSupplierCategory(int supplierCategoryId)
    {
        await _supplierCategoryRepository.DeleteSupplierCategory(supplierCategoryId);
    }
    }
}
