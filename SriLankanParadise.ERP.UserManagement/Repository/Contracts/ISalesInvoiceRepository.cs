﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.Repository.Contracts
{
    public interface ISalesInvoiceRepository
    {
        Task AddSalesInvoice(SalesInvoice salesInvoice);

        Task<IEnumerable<SalesInvoice>> GetAll();

        Task<IEnumerable<SalesInvoice>> GetSalesInvoicesWithoutDraftsByCompanyId(int companyId);

        Task<IEnumerable<SalesInvoice>> GetSalesInvoicesByUserId(int userId);

        Task ApproveSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice);

        Task<SalesInvoice> GetSalesInvoiceBySalesInvoiceId(int salesInvoiceId);

        Task UpdateSalesInvoice(int salesInvoiceId, SalesInvoice salesInvoice);
    }
}