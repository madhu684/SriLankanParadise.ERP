using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class BatchHasGrnMaster
{
    public int BatchHasGrnMasterId { get; set; }

    public int GrnMasterId { get; set; }

    public int BatchId { get; set; }

    public virtual Batch Batch { get; set; } = null!;

    public virtual GrnMaster GrnMaster { get; set; } = null!;
}
