using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SalesOrderDetail
{
    public int SalesOrderDetailId { get; set; }

    public int ItemBatchItemMasterId { get; set; }

    public int? ItemBatchBatchId { get; set; }

    public int SalesOrderId { get; set; }

    public int? Quantity { get; set; }

    public decimal? UnitPrice { get; set; }

    public decimal? TotalPrice { get; set; }

    public virtual Batch Batch { get; set; } = null!;

    public virtual ItemMaster ItemMaster { get; set; }

    public virtual SalesOrder SalesOrder { get; set; } = null!;
}
