using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISalesPersonService
    {
        Task AddSalesPerson(SalesPerson person);
        Task<IEnumerable<SalesPerson>> GetAll();
        Task<SalesPerson?> GetById(int id);
        Task Update(int id, SalesPerson person);
        Task Delete(int id);
    }
}
