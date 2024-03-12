using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class TransactionTypeService :ITransactionTypeService
    {
        private readonly ITransactionTypeRepository _transactionTypeRepository;
        public TransactionTypeService(ITransactionTypeRepository transactionTypeRepository)
        {
            _transactionTypeRepository = transactionTypeRepository;
        }

        public async Task<IEnumerable<TransactionType>> GetTransactionTypes()
        {
            return await _transactionTypeRepository.GetTransactionTypes();
        }

    }
}
