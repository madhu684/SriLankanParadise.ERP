using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesReceiptRepository
    {
        Task AddSalesReceipt(SalesReceipt salesReceipt);

        Task<IEnumerable<SalesReceipt>> GetAll();

        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserId(int userId);

        Task<SalesReceipt> GetSalesReceiptBySalesReceiptId(int salesReceiptId);

        Task UpdateSalesReceipt(int salesReceiptId, SalesReceipt salesReceipt);
    }
}
