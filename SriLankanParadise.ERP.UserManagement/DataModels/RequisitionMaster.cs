using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class RequisitionMaster
{
    public int RequisitionMasterId { get; set; }

    public int? RequestedUserId { get; set; }

    public string? RequestedBy { get; set; }

    public DateTime? RequisitionDate { get; set; }

    public string? PurposeOfRequest { get; set; }

    public int? Status { get; set; }

    public string? ApprovedBy { get; set; }

    public int? ApprovedUserId { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public int? CompanyId { get; set; }

    public string? RequisitionType { get; set; }

    public int? RequestedFromLocationId { get; set; }

    public int? RequestedToLocationId { get; set; }

    public virtual ICollection<IssueMaster> IssueMasters { get; set; } = new List<IssueMaster>();

    public virtual Location? RequestedFromLocation { get; set; }

    public virtual Location? RequestedToLocation { get; set; }

    public virtual ICollection<RequisitionDetail> RequisitionDetails { get; set; } = new List<RequisitionDetail>();
}
