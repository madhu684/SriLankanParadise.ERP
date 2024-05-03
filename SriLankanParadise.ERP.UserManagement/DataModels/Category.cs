using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Category
{
    public int CategoryId { get; set; }

    public string? CategoryName { get; set; }

    public bool Status { get; set; }

    public int? CompanyId { get; set; }

    public virtual ICollection<ItemMaster> ItemMasters { get; set; } = new List<ItemMaster>();

    public virtual ICollection<SupplierCategory> SupplierCategories { get; set; } = new List<SupplierCategory>();
}
