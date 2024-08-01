namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class LocationInventoryMovementRequestModel
    {
        public int MovementTypeId { get; set; }

        public int TransactionTypeId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public int LocationId { get; set; }

        public DateTime? Date { get; set; }

        public int? Qty { get; set; }
        public int? ReferenceNo { get; set; }
        public string? BatchNo { get; set; }

        public int PermissionId { get; set; }
    }
}
