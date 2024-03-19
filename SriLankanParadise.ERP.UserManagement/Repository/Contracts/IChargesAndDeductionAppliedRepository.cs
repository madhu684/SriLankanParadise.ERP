using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IChargesAndDeductionAppliedRepository
    {
        Task AddChargesAndDeductionApplied(ChargesAndDeductionApplied chargesAndDeductionApplied);

        Task<IEnumerable<ChargesAndDeductionApplied>> GetChargesAndDeductionsApplied(int transactionTypeId,
            int transactionId, int companyId);

        Task<ChargesAndDeductionApplied> GetChargesAndDeductionAppliedByChargesAndDeductionAppliedId(int chargesAndDeductionAppliedId);

        Task UpdateChargesAndDeductionApplied(int ChargesAndDeductionAppliedId, ChargesAndDeductionApplied chargesAndDeductionApplied);

        Task DeleteChargesAndDeductionApplied(int ChargesAndDeductionAppliedId);
    }
}
