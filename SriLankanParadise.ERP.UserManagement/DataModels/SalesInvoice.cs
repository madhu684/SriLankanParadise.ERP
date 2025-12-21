using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SalesInvoice
{
    public int SalesInvoiceId { get; set; }

    public DateTime? InvoiceDate { get; set; }

    public DateTime? DueDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public int? Status { get; set; }

    public string? CreatedBy { get; set; }

    public int? CreatedUserId { get; set; }

    public string? ApprovedBy { get; set; }

    public int? ApprovedUserId { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public int? CompanyId { get; set; }

    public int? SalesOrderId { get; set; }

    public string? ReferenceNo { get; set; }

    public decimal? AmountDue { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastUpdatedDate { get; set; }

    public string? ReferenceNumber { get; set; }

    public int? LocationId { get; set; }

    public string? InVoicedPersonName { get; set; }

    public string? InVoicedPersonMobileNo { get; set; }

    public int? AppointmentId { get; set; }
    public int? TokenNo { get; set; }

    public virtual ICollection<SalesInvoiceDetail> SalesInvoiceDetails { get; set; } = new List<SalesInvoiceDetail>();
    public virtual SalesOrder? SalesOrder { get; set; }
    public virtual ICollection<SalesReceiptSalesInvoice> SalesReceiptSalesInvoices { get; set; } = new List<SalesReceiptSalesInvoice>();

}
