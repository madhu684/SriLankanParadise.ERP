using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ITransactionTypeRepository
    {
        Task<IEnumerable<TransactionType>> GetTransactionTypes();
    }
}
