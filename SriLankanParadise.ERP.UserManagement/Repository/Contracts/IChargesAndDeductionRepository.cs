using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface IChargesAndDeductionRepository
    {
        Task AddChargesAndDeduction(ChargesAndDeduction chargesAndDeduction);

        Task<IEnumerable<ChargesAndDeduction>> GetChargesAndDeductionsByCompanyId(int companyId);
    }
}
