﻿using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class SalesOrderDetail
{
    public int SalesOrderDetailId { get; set; }

    public int ItemBatchItemMasterId { get; set; }

    public int ItemBatchBatchId { get; set; }

    public int SalesOrderId { get; set; }

    public int? Quantity { get; set; }

    public decimal? UnitPrice { get; set; }

    public decimal? TotalPrice { get; set; }

    public virtual ItemBatch ItemBatch { get; set; } = null!;

    public virtual SalesOrder SalesOrder { get; set; } = null!;
}
