using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class IssueMaster
{
    public int IssueMasterId { get; set; }

    public int? RequisitionMasterId { get; set; }

    public DateTime? IssueDate { get; set; }

    public string? CreatedBy { get; set; }

    public int? CreatedUserId { get; set; }

    public int? Status { get; set; }

    public string? ApprovedBy { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public int? CompanyId { get; set; }

    public string? IssueType { get; set; }

    public string? ReferenceNumber { get; set; }

    public int? ApprovedUserId { get; set; }

    public int? IssuedLocationId { get; set; }

    public int? TokenNo { get; set; }

    public virtual ICollection<IssueDetail> IssueDetails { get; set; } = new List<IssueDetail>();

    public virtual RequisitionMaster? RequisitionMaster { get; set; } = null!;
}
