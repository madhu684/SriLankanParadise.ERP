﻿namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class CompanyDto
    {
        public int CompanyId { get; set; }

        public string? CompanyName { get; set; }

        public int? SubscriptionPlanId { get; set; }

        public DateTime? SubscriptionExpiredDate { get; set; }

        public virtual SubscriptionDto? SubscriptionPlan { get; set; }

        public bool Status { get; set; }

        public string? LogoPath { get; set; }

        public int? MaxUserCount { get; set; }

        public string? BatchStockType { get; set; }

    }
}
