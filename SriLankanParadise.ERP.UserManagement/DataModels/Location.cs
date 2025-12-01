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

    public int? PriceMasterId { get; set; }

    public string? Alias { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual LocationType? LocationType { get; set; }

    public virtual Location? Parent { get; set; }

    public virtual ItemPriceMaster? ItemPriceMaster { get; set; }

    public virtual ICollection<DailyStockBalance> DailyStockBalances { get; set; } = new List<DailyStockBalance>();

    public virtual ICollection<GrnMaster> GrnMasters { get; set; } = new List<GrnMaster>();

    public virtual ICollection<Location> InverseParent { get; set; } = new List<Location>();

    public virtual ICollection<ItemBatch> ItemBatches { get; set; } = new List<ItemBatch>();

    public virtual ICollection<LocationInventory> LocationInventories { get; set; } = new List<LocationInventory>();

    public virtual ICollection<LocationInventoryGoodsInTransit> LocationInventoryGoodsInTransitFromLocations { get; set; } = new List<LocationInventoryGoodsInTransit>();

    public virtual ICollection<LocationInventoryGoodsInTransit> LocationInventoryGoodsInTransitToLocations { get; set; } = new List<LocationInventoryGoodsInTransit>();

    public virtual ICollection<LocationInventoryMovement> LocationInventoryMovements { get; set; } = new List<LocationInventoryMovement>();

    public virtual ICollection<PurchaseRequisition> PurchaseRequisitionDepartmentNavigations { get; set; } = new List<PurchaseRequisition>();

    public virtual ICollection<PurchaseRequisition> PurchaseRequisitionExpectedDeliveryLocationNavigations { get; set; } = new List<PurchaseRequisition>();

    public virtual ICollection<RequisitionMaster> RequisitionMasterRequestedFromLocations { get; set; } = new List<RequisitionMaster>();

    public virtual ICollection<RequisitionMaster> RequisitionMasterRequestedToLocations { get; set; } = new List<RequisitionMaster>();

    public virtual ICollection<UserLocation> UserLocations { get; set; } = new List<UserLocation>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();

    public virtual ICollection<DailyLocationInventory> DailyLocationInventories { get; set; } = new List<DailyLocationInventory>();
}
