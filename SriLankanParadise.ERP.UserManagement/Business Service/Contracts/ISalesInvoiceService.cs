﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Business_Service.Contracts
{
    public interface ISalesInvoiceService
    {
        Task AddSalesInvoice(SalesInvoice salesInvoice);

        Task<IEnumerable<SalesInvoice>> GetAll();

        Task<IEnumerable<SalesInvoice>> GetSalesInvoicesWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<SalesInvoice>> GetSalesInvoicesByUserId(int userId);

        Task ApproveSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice);

        Task<SalesInvoice> GetSalesInvoiceBySalesInvoiceId(int salesInvoiceId);

        Task UpdateSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice);

        Task DeleteSalesInvoice(int salesInvoiceId);

        Task<SalesInvoice> GetSalesInvoiceById(int salesInvoiceId);
    }
}
