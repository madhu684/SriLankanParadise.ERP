using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class PurchaseOrderDetail
{
    public int PurchaseOrderDetailId { get; set; }

    public int PurchaseOrderId { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal TotalPrice { get; set; }

    public int? ItemMasterId { get; set; }

    public virtual ItemMaster? ItemMaster { get; set; }

    public virtual PurchaseOrder PurchaseOrder { get; set; } = null!;
}
