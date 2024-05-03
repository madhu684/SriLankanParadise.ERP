﻿using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class ExpenseOutRequisitionService : IExpenseOutRequisitionService
    {
        private readonly IExpenseOutRequisitionRepository _expenseOutRequisitionRepository;
        public ExpenseOutRequisitionService(IExpenseOutRequisitionRepository expenseOutRequisitionRepository)
        {
            _expenseOutRequisitionRepository = expenseOutRequisitionRepository;
        }

        public async Task AddExpenseOutRequisition(ExpenseOutRequisition expenseOutRequisition)
        {
            await _expenseOutRequisitionRepository.AddExpenseOutRequisition(expenseOutRequisition);
        }

        public async Task<IEnumerable<ExpenseOutRequisition>> GetAll()
        {
            return await _expenseOutRequisitionRepository.GetAll();
        }

        public async Task<IEnumerable<ExpenseOutRequisition>> GetExpenseOutRequisitionsByCompanyId(int companyId)
        {
            return await _expenseOutRequisitionRepository.GetExpenseOutRequisitionsByCompanyId(companyId);
        }

        public async Task<IEnumerable<ExpenseOutRequisition>> GetExpenseOutRequisitionsByUserId(int userId)
        {
            return await _expenseOutRequisitionRepository.GetExpenseOutRequisitionsByUserId(userId);
        }


        public async Task<ExpenseOutRequisition> GetExpenseOutRequisitionByExpenseOutRequisitionId(int salesReceiptId)
        {
            return await _expenseOutRequisitionRepository.GetExpenseOutRequisitionByExpenseOutRequisitionId(salesReceiptId);
        }

        public async Task UpdateExpenseOutRequisition(int expenseOutRequisitionId, ExpenseOutRequisition expenseOutRequisition)
        {
            await _expenseOutRequisitionRepository.UpdateExpenseOutRequisition(expenseOutRequisitionId, expenseOutRequisition);
        }
    }
}
