﻿using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class LocationInventoryMovement
{
    public int LocationInventoryMovementId { get; set; }

    public int MovementTypeId { get; set; }

    public int TransactionTypeId { get; set; }

    public int ItemMasterId { get; set; }

    public int BatchId { get; set; }

    public int LocationId { get; set; }

    public DateTime? Date { get; set; }

    public int? Qty { get; set; }

    public virtual ItemBatch ItemBatch { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;

    public virtual MovementType MovementType { get; set; } = null!;

    public virtual TransactionType TransactionType { get; set; } = null!;
}