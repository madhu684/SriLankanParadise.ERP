using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Unit
{
    public int UnitId { get; set; }

    public string? UnitName { get; set; }

    public bool? Status { get; set; }

    public int? CompanyId { get; set; }

    public virtual ICollection<ItemMaster> ItemMasters { get; set; } = new List<ItemMaster>();
}
