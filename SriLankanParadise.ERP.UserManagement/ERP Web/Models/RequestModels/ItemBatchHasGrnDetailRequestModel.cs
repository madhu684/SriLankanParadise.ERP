namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class ItemBatchHasGrnDetailRequestModel
    {
        public int GrnDetailId { get; set; }

        public int ItemBatchItemMasterId { get; set; }

        public int ItemBatchBatchId { get; set; }

        public int PermissionId { get; set; }
    }
}
