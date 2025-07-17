using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class EmptyReturnMaster
{
    public int EmptyReturnMasterId { get; set; }

    public int CompanyId { get; set; }

    public int FromLocationId { get; set; }

    public int ToLocationId { get; set; }

    public int? Status { get; set; }

    public string? ApprovedBy { get; set; }

    public int? ApprovedUserId { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public string ReferenceNo { get; set; } = null!; // e.g., "ER1001"

    public DateTime CreateDate { get; set; }

    public int CreatedBy { get; set; }

    public DateTime? ModifyDate { get; set; }

    public int? ModifyedBy { get; set; }

    // 🔗 Navigation Properties
    public virtual Location FromLocation { get; set; } = null!;
    public virtual Location ToLocation { get; set; } = null!;
    public virtual Company Company { get; set; } = null!;

    public virtual ICollection<EmptyReturnDetail> EmptyReturnDetails { get; set; } = new List<EmptyReturnDetail>();
}
