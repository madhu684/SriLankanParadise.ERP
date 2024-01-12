using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class PurchaseRequisition
{
    public int PurchaseRequisitionId { get; set; }

    public int? RequestedUserId { get; set; }

    public string RequestedBy { get; set; } = null!;

    public string Department { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string ContactNo { get; set; } = null!;

    public DateTime RequisitionDate { get; set; }

    public string PurposeOfRequest { get; set; } = null!;

    public DateTime DeliveryDate { get; set; }

    public int DeliveryLocation { get; set; }

    public string? ReferenceNo { get; set; }

    public decimal TotalAmount { get; set; }

    public int Status { get; set; }

    public string? ApprovedBy { get; set; }

    public int? ApprovedUserId { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public virtual Location DeliveryLocationNavigation { get; set; } = null!;

    public virtual ICollection<PurchaseRequisitionDetail> PurchaseRequisitionDetails { get; set; } = new List<PurchaseRequisitionDetail>();
}
