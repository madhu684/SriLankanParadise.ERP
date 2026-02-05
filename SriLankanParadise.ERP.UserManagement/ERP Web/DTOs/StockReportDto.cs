using SriLankanParadise.ERP.UserManagement.DataModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs
{
    public class StockReportDto
    {
        public int itemId { get; set; }
        public int? batchId { get; set; }
        public string? batchNumber { get; set; }
        public string? location { get; set; }
        public string ? itemName { get; set; }
        public string? itemCode { get; set; }
        public string unitName { get; set; }
        public int reorderLevel { get; set; }
        public decimal openingBalance { get; set; }
        public decimal totalIn { get; set; }
        public decimal totalOut { get; set; }
        public decimal closingBalance { get; set; }
        public decimal salesOrder { get; set; } // 1
        public decimal purchaseOrder { get; set; } // 2
        public decimal salesInvoice { get; set; } // 3
        public decimal grn { get; set; } // 4
        public decimal min { get; set; } // 5
        public decimal tin { get; set; } // 6
        public decimal productionIn { get; set; } // 7
        public decimal productionOut { get; set; } // 8
        public decimal packingSlip { get; set; } // 9
        public decimal supplierReturnNote { get; set; } // 10
        public decimal emptyReturnIn { get; set; } // 11
        public decimal emptyReturnOut { get; set; } // 12
        public decimal emptyReturnReduce { get; set; } // 13
        public decimal adjustIn { get; set; } // 14
        public decimal adjustOut { get; set; } // 15
        public decimal trnIn { get; set; } // 18
    }
}
