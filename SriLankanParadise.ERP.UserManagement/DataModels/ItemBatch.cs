using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ItemBatch
{
    public int BatchId { get; set; }

    public int ItemMasterId { get; set; }

    public decimal? CostPrice { get; set; }

    public decimal? SellingPrice { get; set; }

    public bool? Status { get; set; }

    public int? CompanyId { get; set; }

    public string? CreatedBy { get; set; }

    public int? CreatedUserId { get; set; }

    public int? TempQuantity { get; set; }

    public int? LocationId { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public virtual Batch Batch { get; set; } = null!;

    public virtual ICollection<ItemBatchHasGrnDetail> ItemBatchHasGrnDetails { get; set; } = new List<ItemBatchHasGrnDetail>();

    public virtual ItemMaster ItemMaster { get; set; } = null!;

    public virtual Location? Location { get; set; }

    public virtual ICollection<SalesInvoiceDetail> SalesInvoiceDetails { get; set; } = new List<SalesInvoiceDetail>();

    public virtual ICollection<SalesOrderDetail> SalesOrderDetails { get; set; } = new List<SalesOrderDetail>();
}
