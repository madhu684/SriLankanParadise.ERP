using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISupplierService
    {
        Task<IEnumerable<Supplier>> GetSuppliersByCompanyId(int companyId);
       
        Task AddSupplier(Supplier supplier);

    }
}
