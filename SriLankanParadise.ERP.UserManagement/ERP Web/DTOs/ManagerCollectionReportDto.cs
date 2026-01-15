using System;
using System.Collections.Generic;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class ManagerCollectionReportDto
    {
        public DateTime Date { get; set; }
        public List<ManagerCollectionReportUserDto> UserReports { get; set; } = new List<ManagerCollectionReportUserDto>();
        public decimal TotalAmount { get; set; }
        public decimal TotalShort { get; set; }
        public decimal TotalExcess { get; set; }
        public decimal TotalCash { get; set; }
        public decimal TotalBankTransfer { get; set; }
        public decimal TotalGiftVoucher { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalCashInHand { get; set; }
    }

    public class ManagerCollectionReportUserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public List<ManagerCollectionReportSessionDto> Sessions { get; set; } = new List<ManagerCollectionReportSessionDto>();
        public decimal UserTotalAmount { get; set; }
        public decimal UserTotalShort { get; set; }
        public decimal UserTotalExcess { get; set; }
        public decimal UserTotalCash { get; set; }
        public decimal UserTotalBankTransfer { get; set; }
        public decimal UserTotalGiftVoucher { get; set; }
        public decimal UserTotalExpenses { get; set; }
        public decimal UserTotalCashInHand { get; set; }
    }

    public class ManagerCollectionReportSessionDto
    {
        public int? SessionId { get; set; }
        public decimal SessionTotalAmount { get; set; }
        public decimal SessionTotalShort { get; set; }
        public decimal SessionTotalExcess { get; set; }
        public decimal SessionTotalCash { get; set; }
        public decimal SessionTotalBankTransfer { get; set; }
        public decimal SessionTotalGiftVoucher { get; set; }
        public decimal SessionTotalExpenses { get; set; }
        public decimal SessionTotalCashInHand { get; set; }
    }
}
