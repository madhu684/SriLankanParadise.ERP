using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class User
{
    public int UserId { get; set; }

    public string? Username { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string ContactNo { get; set; } = null!;

    public string Firstname { get; set; } = null!;

    public string? Lastname { get; set; }

    public int CompanyId { get; set; }

    public bool Status { get; set; }

    public int? LocationId { get; set; }

    public virtual ICollection<ActionLog> ActionLogs { get; set; } = new List<ActionLog>();

    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();

    public virtual ICollection<CashierExpenseOut> CashierExpenseOuts { get; set; } = new List<CashierExpenseOut>();

    public virtual ICollection<CashierSession> CashierSessions { get; set; } = new List<CashierSession>();

    public virtual Company Company { get; set; } = null!;

    public virtual Location? Location { get; set; }

    public virtual ICollection<UserPermission> UserPermissions { get; set; } = new List<UserPermission>();

    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
