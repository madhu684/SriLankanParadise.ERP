namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class ItemMasterDto
    {
        public int ItemMasterId { get; set; }

        public int UnitId { get; set; }

        public virtual UnitDto? Unit { get; set; }

        public int CategoryId { get; set; }

        public virtual CategoryDto? Category { get; set; }

        public string? ItemName { get; set; }


        public bool? Status { get; set; }

        public int? CompanyId { get; set; }

        public string? CreatedBy { get; set; }

        public int? CreatedUserId { get; set; }

        public int? ItemTypeId { get; set; }

        public int? ParentId { get; set; }

        public virtual ItemTypeDto? ItemType { get; set; }

    }
}
