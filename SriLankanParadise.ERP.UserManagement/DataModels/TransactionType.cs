using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class TransactionType
{
    public int TransactionTypeId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<ChargesAndDeductionApplied> ChargesAndDeductionApplieds { get; set; } = new List<ChargesAndDeductionApplied>();
}
