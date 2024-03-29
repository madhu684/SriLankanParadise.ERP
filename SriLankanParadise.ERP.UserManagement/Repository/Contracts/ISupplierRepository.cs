using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISupplierRepository
    {
        Task<IEnumerable<Supplier>> GetSuppliersByCompanyId(int companyId);

        Task AddSupplier(Supplier supplier);
    }
}
