﻿namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ItemBatchRequestModel
    {
        public int BatchId { get; set; }

        public int ItemMasterId { get; set; }

        public decimal? CostPrice { get; set; }

        public decimal? SellingPrice { get; set; }

        public bool? Status { get; set; }

        public int? CompanyId { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public int PermissionId { get; set; }
    }
}
