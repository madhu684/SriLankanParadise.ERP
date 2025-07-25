﻿namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class DailyLocationInventoryRequestModel
    {
        public DateOnly RunDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public int LocationInventoryId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }

        public decimal? StockInHand { get; set; }

        public string? BatchNo { get; set; }
        public DateTime? ExpirationDate { get; set; }

        public DateTime TransactionDate { get; set; }
        public int MovementTypeId { get; set; }
    }
}
