using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ItemMaster
{
    public int ItemMasterId { get; set; }

    public int? UnitId { get; set; }

    public int CategoryId { get; set; }

    public string? ItemName { get; set; }

    public bool? Status { get; set; }

    public int? CompanyId { get; set; }

    public string? CreatedBy { get; set; }

    public int? CreatedUserId { get; set; }

    public int? ItemTypeId { get; set; }

    public int? ParentId { get; set; }

    public int? InventoryUnitId { get; set; }

    public decimal? ConversionRate { get; set; }

    public string? ItemCode { get; set; }

    public int? ReorderLevel { get; set; }

    public bool? IsInventoryItem { get; set; }

    public decimal? UnitPrice { get; set; }

    public decimal? CostRatio { get; set; }

    public decimal? FOBInUSD { get; set; }

    public decimal? LandedCost { get; set; }

    public decimal? MinNetSellingPrice { get; set; }

    public decimal? SellingPrice { get; set; }

    public decimal? MRP { get; set; }

    public decimal? CompetitorPrice { get; set; }

    public decimal LabelPrice { get; set; }

    public decimal? AverageSellingPrice { get; set; }

    public decimal? StockClearance { get; set; }

    public decimal? BulkPrice { get; set; }
    public int? SupplierId { get; set; }

    //nav properties
    public virtual Category Category { get; set; } = null!;
    public virtual Unit? InventoryUnit { get; set; }
    public virtual ItemType? ItemType { get; set; }
    public virtual ItemMaster? Parent { get; set; }
    public virtual Unit Unit { get; set; } = null!;
    public virtual Supplier? Supplier { get; set; }
    public virtual ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; set; } = new List<PurchaseOrderDetail>();
    public virtual ICollection<PurchaseRequisitionDetail> PurchaseRequisitionDetails { get; set; } = new List<PurchaseRequisitionDetail>();
    public virtual ICollection<RequisitionDetail> RequisitionDetails { get; set; } = new List<RequisitionDetail>();
    public virtual ICollection<SubItemMaster> SubItemMasters { get; set; } = new List<SubItemMaster>();
    public virtual ICollection<SupplyReturnDetail> SupplyReturnDetails { get; set; } = new List<SupplyReturnDetail>();
    public virtual ICollection<GrnDetail> GrnDetails { get; set; } = new List<GrnDetail>();
    public virtual ICollection<ItemMaster> InverseParent { get; set; } = new List<ItemMaster>();
    public virtual ICollection<IssueDetail> IssueDetails { get; set; } = new List<IssueDetail>();
    public virtual ICollection<ItemBatch> ItemBatches { get; set; } = new List<ItemBatch>();
    public virtual ICollection<DailyLocationInventory> DailyLocationInventories { get; set; } = new List<DailyLocationInventory>();
    public virtual ICollection<SalesInvoiceDetail> SalesInvoiceDetails { get; set; } = new List<SalesInvoiceDetail>();
    public virtual ICollection<ItemPriceDetail> ItemPriceDetails { get; set; } = new List<ItemPriceDetail>();
}