using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class CashierExpenseOut
{
    public int CashierExpenseOutId { get; set; }

    public int? UserId { get; set; }

    public string? Description { get; set; }

    public decimal? Amount { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? CompanyId { get; set; }

    public int? ExpenseOutRequisitionId { get; set; }

    public virtual ExpenseOutRequisition? ExpenseOutRequisition { get; set; }

    public virtual User? User { get; set; }
}
