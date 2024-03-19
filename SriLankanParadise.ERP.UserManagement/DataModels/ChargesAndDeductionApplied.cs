using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ChargesAndDeductionApplied
{
    public int ChargesAndDeductionAppliedId { get; set; }

    public int ChargesAndDeductionId { get; set; }

    public int? TransactionId { get; set; }

    public int? TransactionTypeId { get; set; }

    public int? LineItemId { get; set; }

    public decimal? AppliedValue { get; set; }

    public DateTime? DateApplied { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? Status { get; set; }

    public int? CompanyId { get; set; }

    public virtual ChargesAndDeduction ChargesAndDeduction { get; set; } = null!;

    public virtual TransactionType? TransactionType { get; set; }
}
