﻿namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class RequisitionDetailRequestModel
    {
        public int RequisitionMasterId { get; set; }

        public int ItemMasterId { get; set; }

        public int? Quantity { get; set; }

        public int PermissionId { get; set; }
    }
}