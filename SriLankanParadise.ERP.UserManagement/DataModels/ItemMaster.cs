using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ItemMaster
{
    public int ItemMasterId { get; set; }

    public int UnitId { get; set; }

    public int CategoryId { get; set; }

    public string? ItemName { get; set; }

    public int? StockQuantity { get; set; }

    public decimal? SellingPrice { get; set; }

    public decimal? CostPrice { get; set; }

    public bool? Status { get; set; }

    public int? CompanyId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<ItemBatch> ItemBatches { get; set; } = new List<ItemBatch>();

    public virtual Unit Unit { get; set; } = null!;
}
