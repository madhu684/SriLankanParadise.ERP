using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ChargesAndDeductionService : IChargesAndDeductionService
    {
        private readonly IChargesAndDeductionRepository _chargesAndDeductionRepository;
        public ChargesAndDeductionService(IChargesAndDeductionRepository chargesAndDeductionRepository)
        {
            _chargesAndDeductionRepository = chargesAndDeductionRepository;
        }

        public async Task AddChargesAndDeduction(ChargesAndDeduction chargesAndDeduction)
        {
            await _chargesAndDeductionRepository.AddChargesAndDeduction(chargesAndDeduction);
        }

        public async Task<IEnumerable<ChargesAndDeduction>> GetChargesAndDeductionsByCompanyId(int companyId)
        {
            return await _chargesAndDeductionRepository.GetChargesAndDeductionsByCompanyId(companyId);
        }
    }
}
