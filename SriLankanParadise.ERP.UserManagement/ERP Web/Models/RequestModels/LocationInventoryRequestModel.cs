﻿namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class LocationInventoryRequestModel
    {
        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }
        public int MovementTypeId { get; set; }

        public decimal? StockInHand { get; set; }
        public string? BatchNo { get; set; }

        public int PermissionId { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
