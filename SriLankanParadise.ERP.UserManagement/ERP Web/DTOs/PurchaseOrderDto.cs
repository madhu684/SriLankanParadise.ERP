﻿namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class PurchaseOrderDto
    {
        public int PurchaseOrderId { get; set; }


        public int SupplierId { get; set; }

        public virtual SupplierDto? Supplier { get; set; }

        public DateTime? OrderDate { get; set; }


        public decimal? TotalAmount { get; set; }

        public int? Status { get; set; }

        public string? Remark { get; set; }

        public string? OrderedBy { get; set; }

        public string? ApprovedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public int? OrderedUserId { get; set; }

        public int? ApprovedUserId { get; set; }

        public string? ReferenceNo { get; set; }

        public int? CompanyId { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public virtual IEnumerable<PurchaseOrderDetailDto>? PurchaseOrderDetails { get; set; }

    }
}
