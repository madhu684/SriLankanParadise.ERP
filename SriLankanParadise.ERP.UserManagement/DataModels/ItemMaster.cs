using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ItemMaster
{
    public int ItemMasterId { get; set; }

    public int UnitId { get; set; }

    public int CategoryId { get; set; }

    public string? ItemName { get; set; }

    public bool? Status { get; set; }

    public int? CompanyId { get; set; }

    public string? CreatedBy { get; set; }

    public int? CreatedUserId { get; set; }

    public int? ItemTypeId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<IssueDetail> IssueDetails { get; set; } = new List<IssueDetail>();

    public virtual ICollection<ItemBatch> ItemBatches { get; set; } = new List<ItemBatch>();

    public virtual ItemType? ItemType { get; set; }

    public virtual ICollection<RequisitionDetail> RequisitionDetails { get; set; } = new List<RequisitionDetail>();

    public virtual Unit Unit { get; set; } = null!;
}
