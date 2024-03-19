using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface IChargesAndDeductionService
    {
        Task AddChargesAndDeduction(ChargesAndDeduction chargesAndDeduction);

        Task<IEnumerable<ChargesAndDeduction>> GetChargesAndDeductionsByCompanyId(int companyId);
    }
}
