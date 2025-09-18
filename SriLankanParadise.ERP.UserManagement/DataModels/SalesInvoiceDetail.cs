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

    public int? ItemBatchItemMasterId { get; set; }

    public int? ItemBatchBatchId { get; set; }

    public virtual Batch? Batch { get; set; }

    public virtual ItemMaster? ItemMaster { get; set; }

    public virtual SalesInvoice SalesInvoice { get; set; } = null!;
}
