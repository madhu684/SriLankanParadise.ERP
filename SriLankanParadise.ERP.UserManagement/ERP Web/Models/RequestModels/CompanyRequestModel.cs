﻿namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class CompanyRequestModel
    {
        public string? CompanyName { get; set; }

        public int? SubscriptionPlanId { get; set; }

        public DateTime? SubscriptionExpiredDate { get; set; }
        public int PermissionId { get; set; }

        public string? LogoPath { get; set; }

        public int? MaxUserCount { get; set; }

        public bool Status { get; set; }

        public string? BatchStockType { get; set; }
    }
}
