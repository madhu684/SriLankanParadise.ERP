using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesPersonRepository
    {
        Task AddSalesPerson(SalesPerson salesPerson);
        Task<IEnumerable<SalesPerson>> GetAll();
        Task<SalesPerson?> GetById(int id);
        Task Update(int id, SalesPerson salesPerson);
        Task Delete(int id);
        Task ActiveDeactiveSalesPerson(int salesPersonId, bool isActive);
    }
}
