﻿using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Unit
{
    public int UnitId { get; set; }

    public string? UnitName { get; set; }

    public bool? Status { get; set; }

    public int? CompanyId { get; set; }

    public int? MeasurementTypeId { get; set; }

    public virtual ICollection<ItemMaster> ItemMasterInventoryUnits { get; set; } = new List<ItemMaster>();

    public virtual ICollection<ItemMaster> ItemMasterUnits { get; set; } = new List<ItemMaster>();

    public virtual MeasurementType? MeasurementType { get; set; }
}
