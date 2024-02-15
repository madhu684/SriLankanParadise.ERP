using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IUnitRepository
    {
        Task AddUnit(Unit unit);

        Task<IEnumerable<Unit>> GetAll();

        Task<IEnumerable<Unit>> GetUnitsByCompanyId(int companyId);

    }
}
