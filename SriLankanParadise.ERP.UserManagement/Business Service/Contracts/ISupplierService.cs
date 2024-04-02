using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISupplierService
    {
        Task<IEnumerable<Supplier>> GetSuppliersByCompanyId(int companyId);
       
        Task AddSupplier(Supplier supplier);

        Task<Supplier> GetSupplierBySupplierId(int supplierId);

        Task UpdateSupplier(int supplierId, Supplier supplier);

        Task DeleteSupplier(int supplierId);

    }
}
