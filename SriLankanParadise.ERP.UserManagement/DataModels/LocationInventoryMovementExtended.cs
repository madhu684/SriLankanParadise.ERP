﻿using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class LocationInventoryMovementExtended
{
    public int LocationInventoryMovementId { get; set; }

    public int MovementTypeId { get; set; }

    public int TransactionTypeId { get; set; }

    public int ItemMasterId { get; set; }

    public int BatchId { get; set; }

    public int LocationId { get; set; }
    public int? ReferenceNo { get; set; }
    public string? BatchNo { get; set; }

    public DateTime? Date { get; set; }

    public decimal? Qty { get; set; }
    public DateTime? TransactionDate { get; set; }
    public decimal? GRNQty { get; set; }
    public decimal? ProductionInQty { get; set; }
    public decimal? ReturnInQty { get; set; }
    public decimal? ProductionOutQty { get; set; }
    public decimal? ReturnQty { get; set; }

    public virtual ItemBatch ItemBatch { get; set; } = null!;

    public virtual Location Location { get; set; } = null!;

    public virtual MovementType MovementType { get; set; } = null!;

    public virtual TransactionType TransactionType { get; set; } = null!;
}
