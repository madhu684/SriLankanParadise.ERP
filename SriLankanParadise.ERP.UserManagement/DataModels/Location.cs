using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Location
{
    public int LocationId { get; set; }

    public int CompanyId { get; set; }

    public string? LocationName { get; set; }

    public bool? Status { get; set; }

    public int? LocationTypeId { get; set; }

    public int? ParentId { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual ICollection<Location> InverseParent { get; set; } = new List<Location>();

    public virtual ICollection<ItemBatch> ItemBatches { get; set; } = new List<ItemBatch>();

    public virtual LocationType? LocationType { get; set; }

    public virtual Location? Parent { get; set; }

    public virtual ICollection<PurchaseRequisition> PurchaseRequisitions { get; set; } = new List<PurchaseRequisition>();

    public virtual ICollection<RequisitionMaster> RequisitionMasterRequestedFromLocations { get; set; } = new List<RequisitionMaster>();

    public virtual ICollection<RequisitionMaster> RequisitionMasterRequestedToLocations { get; set; } = new List<RequisitionMaster>();
}
