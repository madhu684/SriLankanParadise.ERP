using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class IssueDetail
{
    public int IssueDetailId { get; set; }

    public int IssueMasterId { get; set; }

    public int ItemMasterId { get; set; }

    public int BatchId { get; set; }

    public int? Quantity { get; set; }

    public virtual Batch Batch { get; set; } = null!;

    public virtual IssueMaster IssueMaster { get; set; } = null!;

    public virtual ItemMaster ItemMaster { get; set; } = null!;
}
