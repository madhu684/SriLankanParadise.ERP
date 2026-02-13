using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class GrnMaster
{
    public int GrnMasterId { get; set; }

    public DateTime? GrnDate { get; set; }

    public string? ReceivedBy { get; set; }

    public DateTime? ReceivedDate { get; set; }

    public int? Status { get; set; }

    public int? PurchaseOrderId { get; set; }

    public int? PurchaseRequisitionId { get; set; }

    public int? SupplierId { get; set; }
    public int? SupplyReturnMasterId { get; set; }

    public int? CompanyId { get; set; }

    public int? ReceivedUserId { get; set; }

    public string? ApprovedBy { get; set; }

    public int? ApprovedUserId { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastUpdatedDate { get; set; }

    public string? GrnType { get; set; }

    public int? WarehouseLocationId { get; set; }

    public string? CustDekNo { get; set; }

    public string? GrnReferenceNo { get; set; }

    public virtual ICollection<BatchHasGrnMaster> BatchHasGrnMasters { get; set; } = new List<BatchHasGrnMaster>();

    public virtual ICollection<GrnDetail> GrnDetails { get; set; } = new List<GrnDetail>();

    public virtual PurchaseOrder? PurchaseOrder { get; set; }

    public virtual Location? WarehouseLocation { get; set; }
}
