﻿using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class ChargesAndDeductionDto
    {
        public int ChargesAndDeductionId { get; set; }

        public string? DisplayName { get; set; }

        public string? Description { get; set; }

        public decimal? Amount { get; set; }

        public decimal? Percentage { get; set; }

        public string? Sign { get; set; }

        public DateTime? DateApplied { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool? Status { get; set; }

        public bool? IsApplicableForLineItem { get; set; }

        public int? CompanyId { get; set; }

    }
}