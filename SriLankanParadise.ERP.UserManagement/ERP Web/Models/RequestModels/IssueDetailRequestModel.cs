﻿using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels
{
    public class IssueDetailRequestModel
    {
        public int IssueMasterId { get; set; }

        public int ItemMasterId { get; set; }

        public int BatchId { get; set; }

        public decimal? Quantity { get; set; }

        public int PermissionId { get; set; }
  
    }
}
