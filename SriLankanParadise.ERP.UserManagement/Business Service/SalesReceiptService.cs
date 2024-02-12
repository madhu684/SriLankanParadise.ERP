﻿using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SalesReceiptService : ISalesReceiptService
    {
        private readonly ISalesReceiptRepository _salesReceiptRepository;
        public SalesReceiptService(ISalesReceiptRepository salesReceiptRepository)
        {
            _salesReceiptRepository = salesReceiptRepository;
        }

        public async Task AddSalesReceipt(SalesReceipt salesReceipt)
        {
            await _salesReceiptRepository.AddSalesReceipt(salesReceipt);
        }

        public async Task<IEnumerable<SalesReceipt>> GetAll()
        {
            return await _salesReceiptRepository.GetAll();
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsWithoutDraftsByCompanyId(int companyId)
        {
            return await _salesReceiptRepository.GetSalesReceiptsWithoutDraftsByCompanyId(companyId);
        }

        public async Task<IEnumerable<SalesReceipt>> GetSalesReceiptsByUserId(int userId)
        {
            return await _salesReceiptRepository.GetSalesReceiptsByUserId(userId);
        }

        
        public async Task<SalesReceipt> GetSalesReceiptBySalesReceiptId(int salesReceiptId)
        {
            return await _salesReceiptRepository.GetSalesReceiptBySalesReceiptId(salesReceiptId);
        }

        public async Task UpdateSalesReceipt(int salesReceiptId, SalesReceipt salesReceipt)
        {
            await _salesReceiptRepository.UpdateSalesReceipt(salesReceiptId, salesReceipt);
        }
    }
}
