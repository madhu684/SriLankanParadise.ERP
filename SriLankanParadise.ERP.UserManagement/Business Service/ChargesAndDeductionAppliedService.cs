using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ChargesAndDeductionAppliedService : IChargesAndDeductionAppliedService
    {
        private readonly IChargesAndDeductionAppliedRepository _chargesAndDeductionAppliedRepository;
        public ChargesAndDeductionAppliedService(IChargesAndDeductionAppliedRepository chargesAndDeductionAppliedRepository)
        {
            _chargesAndDeductionAppliedRepository = chargesAndDeductionAppliedRepository;
        }

        public async Task AddChargesAndDeductionApplied(ChargesAndDeductionApplied chargesAndDeductionApplied)
        {
            await _chargesAndDeductionAppliedRepository.AddChargesAndDeductionApplied(chargesAndDeductionApplied);
        }

        public async Task<IEnumerable<ChargesAndDeductionApplied>> GetChargesAndDeductionsApplied(int transactionTypeId,
            int transactionId, int companyId)
        {
            return await _chargesAndDeductionAppliedRepository.GetChargesAndDeductionsApplied(transactionTypeId, transactionId, companyId);
        }

        public async Task<ChargesAndDeductionApplied> GetChargesAndDeductionAppliedByChargesAndDeductionAppliedId(int chargesAndDeductionAppliedId)
        {
            return await _chargesAndDeductionAppliedRepository.GetChargesAndDeductionAppliedByChargesAndDeductionAppliedId(chargesAndDeductionAppliedId);
        }

        public async Task UpdateChargesAndDeductionApplied(int chargesAndDeductionAppliedId, ChargesAndDeductionApplied chargesAndDeductionApplied)
        {
            await _chargesAndDeductionAppliedRepository.UpdateChargesAndDeductionApplied(chargesAndDeductionAppliedId, chargesAndDeductionApplied);
        }

        public async Task DeleteChargesAndDeductionApplied(int chargesAndDeductionAppliedId)
        {
            await _chargesAndDeductionAppliedRepository.DeleteChargesAndDeductionApplied(chargesAndDeductionAppliedId);
        }
    }
}
