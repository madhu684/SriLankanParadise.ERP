using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class RequisitionDetail
{
    public int RequisitionDetailId { get; set; }

    public int RequisitionMasterId { get; set; }

    public int ItemMasterId { get; set; }

    public int? Quantity { get; set; }

    public virtual ItemMaster ItemMaster { get; set; } = null!;

    public virtual RequisitionMaster RequisitionMaster { get; set; } = null!;
}
