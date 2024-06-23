using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class SupplierCategoryDto
    {
        public int SupplierCategoryId { get; set; }

        public int? SupplierId { get; set; }

        public int? CategoryId { get; set; }

        public virtual CategoryDto? Category { get; set; }

    }
}
