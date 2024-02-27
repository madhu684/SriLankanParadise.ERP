using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SalesReceiptSalesInvoice
{
    public int SalesReceiptSalesInvoiceId { get; set; }

    public int? SalesReceiptId { get; set; }

    public int? SalesInvoiceId { get; set; }

    public decimal? SettledAmount { get; set; }

    public virtual SalesInvoice? SalesInvoice { get; set; }

    public virtual SalesReceipt? SalesReceipt { get; set; }
}
