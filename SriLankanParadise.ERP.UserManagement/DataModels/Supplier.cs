using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class Supplier
{
    public int SupplierId { get; set; }

    public int CompanyId { get; set; }

    public string SupplierName { get; set; } = null!;

    public string ContactPerson { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? AddressLine1 { get; set; }

    public string? AddressLine2 { get; set; }

    public string? OfficeContactNo { get; set; }

    public string? BusinessRegistrationNo { get; set; }

    public string? VatregistrationNo { get; set; }

    public int? CompanyTypeId { get; set; }

    public int? BusinessTypeId { get; set; }

    public string? SupplierLogoPath { get; set; }

    public int? Status { get; set; }

    public decimal? Rating { get; set; }

    public string? Remarks { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastUpdatedDate { get; set; }

    public DateTime? DeletedDate { get; set; }

    public int? DeletedUserId { get; set; }

    public int? CreatedUserId { get; set; }

    public virtual BusinessType? BusinessType { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual CompanyType? CompanyType { get; set; }

    public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();

    public virtual ICollection<SupplierAttachment> SupplierAttachments { get; set; } = new List<SupplierAttachment>();

    public virtual ICollection<SupplierCategory> SupplierCategories { get; set; } = new List<SupplierCategory>();
}
