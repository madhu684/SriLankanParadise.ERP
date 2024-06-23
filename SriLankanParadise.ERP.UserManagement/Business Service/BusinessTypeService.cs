using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class BusinessTypeService : IBusinessTypeService
    {
        private readonly IBusinessTypeRepository _businessTypeRepository;
        public BusinessTypeService(IBusinessTypeRepository businessTypeRepository)
        {
            _businessTypeRepository = businessTypeRepository;
        }

        public async Task AddBusinessType(BusinessType businessType)
        {
            await _businessTypeRepository.AddBusinessType(businessType);
        }

        public async Task<IEnumerable<BusinessType>> GetAll()
        {
            return await _businessTypeRepository.GetAll();
        }

    }
}
