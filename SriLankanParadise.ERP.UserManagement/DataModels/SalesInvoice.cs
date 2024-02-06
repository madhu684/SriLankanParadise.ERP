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

    public virtual ICollection<SalesInvoiceDetail> SalesInvoiceDetails { get; set; } = new List<SalesInvoiceDetail>();
}
