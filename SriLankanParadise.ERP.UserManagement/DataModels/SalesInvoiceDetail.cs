using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SalesInvoiceDetail
{
    public int SalesInvoiceDetailId { get; set; }

    public int SalesInvoiceId { get; set; }

    public int? Quantity { get; set; }

    public decimal? UnitPrice { get; set; }

    public decimal? TotalPrice { get; set; }

    public virtual SalesInvoice SalesInvoice { get; set; } = null!;
}
