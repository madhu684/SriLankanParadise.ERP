using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class UnitService : IUnitService
    {
        private readonly IUnitRepository _unitRepository;
        public UnitService(IUnitRepository unitRepository)
        {
            _unitRepository = unitRepository;
        }

        public async Task AddUnit(Unit unit)
        {
            await _unitRepository.AddUnit(unit);
        }

        public async Task<IEnumerable<Unit>> GetAll()
        {
            return await _unitRepository.GetAll();
        }

        public async Task<IEnumerable<Unit>> GetUnitsByCompanyId(int companyId)
        {
            return await _unitRepository.GetUnitsByCompanyId(companyId);
        }
    }
}
