using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SalesReceipt
{
    public int SalesReceiptId { get; set; }

    public DateTime? ReceiptDate { get; set; }

    public decimal? AmountReceived { get; set; }

    public string? ReferenceNo { get; set; }

    public int? CompanyId { get; set; }

    public int? PaymentModeId { get; set; }

    public string? CreatedBy { get; set; }

    public int? CreatedUserId { get; set; }

    public int? Status { get; set; }

    public virtual PaymentMode? PaymentMode { get; set; }

    public virtual ICollection<SalesReceiptSalesInvoice> SalesReceiptSalesInvoices { get; set; } = new List<SalesReceiptSalesInvoice>();
}
