using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SupplierDto
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

        public virtual CompanyTypeDto? CompanyType { get; set; }

        public int? BusinessTypeId { get; set; }

        public virtual BusinessTypeDto? BusinessType { get; set; }

        public string? SupplierLogoPath { get; set; }

        public int? Status { get; set; }

        public decimal? Rating { get; set; }

        public string? Remarks { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public DateTime? DeletedDate { get; set; }

        public int? DeletedUserId { get; set; }

        public int? CreatedUserId { get; set; }

        public virtual IEnumerable<SupplierCategoryDto>? SupplierCategories { get; set; }

        public virtual ICollection<SupplierAttachmentDto>? SupplierAttachments { get; set; }
    }
}
