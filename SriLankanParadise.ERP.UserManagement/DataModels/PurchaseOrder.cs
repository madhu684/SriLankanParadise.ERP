using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class PurchaseOrder
{
    public int PurchaseOrderId { get; set; }

    public int SupplierId { get; set; }

    public DateTime? OrderDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public int Status { get; set; }

    public string? Remark { get; set; }

    public string? OrderedBy { get; set; }

    public string? ApprovedBy { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public int? OrderedUserId { get; set; }

    public int? ApprovedUserId { get; set; }

    public string? ReferenceNo { get; set; }

    public int? CompanyId { get; set; }

    public DateTime? LastUpdatedDate { get; set; }

    public int? PurchaseRequisitionId { get; set; }

    public virtual ICollection<GrnMaster> GrnMasters { get; set; } = new List<GrnMaster>();

    public virtual ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; set; } = new List<PurchaseOrderDetail>();

    public virtual Supplier Supplier { get; set; } = null!;
}
