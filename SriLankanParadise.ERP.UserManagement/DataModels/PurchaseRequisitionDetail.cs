using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class PurchaseRequisitionDetail
{
    public int PurchaseRequisitionDetailId { get; set; }

    public int PurchaseRequisitionId { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal TotalPrice { get; set; }

    public int? ItemMasterId { get; set; }

    public virtual ItemMaster? ItemMaster { get; set; }

    public virtual PurchaseRequisition PurchaseRequisition { get; set; } = null!;
}
