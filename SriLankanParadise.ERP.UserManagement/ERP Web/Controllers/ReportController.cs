using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System;
using System.Collections.Generic;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [Route("api/report")]
    [ApiController]
    public class ReportController : BaseApiController
    {
        private readonly ILocationInventoryService _locationInventoryService;
        private readonly ILocationInventoryMovementService _locationInventoryMovementService;
        private readonly IDailyLocationInventoryService _dailyLocationInventoryService;
        private readonly IItemMasterService _itemMasterService;
        private readonly ILocationService _locationService;
        private readonly ISalesReceiptService _salesReceiptService;
        private readonly ICashierExpenseOutService _cashierExpenseOutService;
        private readonly ICashierSessionService _cashierSessionService;
        private readonly ISalesInvoiceService _salesInvoiceService;
        private readonly IMapper _mapper;
        private readonly ILogger<ReportController> _logger;

        public ReportController
            (
                ILocationInventoryService locationInventoryService,
                ILocationInventoryMovementService locationInventoryMovementService,
                IDailyLocationInventoryService dailyLocationInventoryService,
                IItemMasterService itemMasterService,
                ILocationService locationService,
                ISalesReceiptService salesReceiptService,
                ICashierExpenseOutService cashierExpenseOutService,
                ICashierSessionService cashierSessionService,
                ISalesInvoiceService salesInvoiceService,
                IMapper mapper,
                ILogger<ReportController> logger
            )
        {
            _locationInventoryService = locationInventoryService;
            _locationInventoryMovementService = locationInventoryMovementService;
            _dailyLocationInventoryService = dailyLocationInventoryService;
            _itemMasterService = itemMasterService;
            _locationService = locationService;
            _salesReceiptService = salesReceiptService;
            _cashierExpenseOutService = cashierExpenseOutService;
            _cashierSessionService = cashierSessionService;
            _salesInvoiceService = salesInvoiceService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet("StockReport/{fromDate}/{toDate}/{locationId}")]
        public async Task<ApiResponseModel> StockReport([FromRoute] DateTime fromDate, [FromRoute] DateTime toDate, [FromRoute] int locationId)
        {
            try
            {
                var inventoryItems = new List<StockReportDto>();

                var previousDate = fromDate.AddDays(-1);
                var previousDateOnly = new DateOnly(previousDate.Year, previousDate.Month, previousDate.Day);

                var alreadyStockedItemsLocInv = await _dailyLocationInventoryService.Get(previousDateOnly, locationId);
                var allMovements = await _locationInventoryMovementService.ByDateRangeAndLocationId(fromDate, toDate, locationId);

                if (alreadyStockedItemsLocInv != null && alreadyStockedItemsLocInv.Any())
                {
                    foreach (var item in alreadyStockedItemsLocInv)
                    {
                        inventoryItems.Add(new StockReportDto
                        {
                            itemId = item.ItemMasterId,
                            batchId = item.BatchId,
                            batchNumber = item.Batch?.BatchRef ?? "-",
                            location = item.Location?.LocationName,
                            itemName = item.ItemMaster?.ItemName ?? "-",
                            itemCode = item.ItemMaster?.ItemCode ?? "-",
                            unitName = item.ItemMaster?.Unit?.UnitName ?? "-",
                            reorderLevel = item.ItemMaster?.ReorderLevel ?? 0,
                            openingBalance = item.StockInHand ?? 0,
                            totalIn = 0,
                            totalOut = 0,
                            closingBalance = 0,
                            salesOrder = 0,
                            purchaseOrder = 0,
                            salesInvoice = 0,
                            grn = 0,
                            min = 0,
                            tin = 0,
                            productionIn = 0,
                            productionOut = 0,
                            packingSlip = 0,
                            supplierReturnNote = 0,
                            emptyReturnIn = 0,
                            emptyReturnOut = 0,
                            emptyReturnReduce = 0,
                            adjustIn = 0,
                            adjustOut = 0
                        });
                    }
                }

                // add movements
                if (allMovements != null && allMovements.Any())
                {
                    foreach (var movement in allMovements)
                    {
                        var itemDto = inventoryItems.FirstOrDefault(i => i.itemId == movement.ItemMasterId && i.batchId == movement.BatchId);

                        if (itemDto == null)
                        {
                            var itemMaster = await _itemMasterService.GetItemMasterByItemMasterId(movement.ItemMasterId);
                            var location = await _locationService.GetLocationByLocationId(movement.LocationId);

                            itemDto = new StockReportDto
                            {
                                itemId = movement.ItemMasterId,
                                batchId = movement.BatchId,
                                batchNumber = movement.Batch?.BatchRef ?? "-",
                                location = location.LocationName ?? "-",
                                itemName = itemMaster.ItemName ?? "-",
                                itemCode = itemMaster.ItemCode ?? "-",
                                unitName = itemMaster.Unit?.UnitName ?? "-",
                                reorderLevel = itemMaster.ReorderLevel ?? 0,
                                openingBalance = 0,
                                totalIn = 0,
                                totalOut = 0,
                                closingBalance = 0,
                                salesOrder = 0,
                                purchaseOrder = 0,
                                salesInvoice = 0,
                                grn = 0,
                                min = 0,
                                tin = 0,
                                productionIn = 0,
                                productionOut = 0,
                                packingSlip = 0,
                                supplierReturnNote = 0,
                                emptyReturnIn = 0,
                                emptyReturnOut = 0,
                                emptyReturnReduce = 0,
                                adjustIn = 0,
                                adjustOut = 0
                            };
                            inventoryItems.Add(itemDto);
                        }

                        decimal qty = movement.Qty ?? 0;

                        // Map transaction types
                        switch (movement.TransactionTypeId)
                        {
                            case 1: itemDto.salesOrder += qty; break;
                            case 2: itemDto.purchaseOrder += qty; break;
                            case 3: itemDto.salesInvoice += qty; break;
                            case 4: itemDto.grn += qty; break;
                            case 5: itemDto.min += qty; break;
                            case 6: itemDto.tin += qty; break;
                            case 7: itemDto.productionIn += qty; break;
                            case 8: itemDto.productionOut += qty; break;
                            case 9: itemDto.packingSlip += qty; break;
                            case 10: itemDto.supplierReturnNote += qty; break;
                            case 11: itemDto.emptyReturnIn += qty; break;
                            case 12: itemDto.emptyReturnOut += qty; break;
                            case 13: itemDto.emptyReturnReduce += qty; break;
                            case 14: itemDto.adjustIn += qty; break;
                            case 15: itemDto.adjustOut += qty; break;
                        }

                        // Calculate totalIn and totalOut based on MovementTypeId
                        if (movement.MovementTypeId == 1) // In
                        {
                            itemDto.totalIn += qty;
                        }
                        else if (movement.MovementTypeId == 2) // Out
                        {
                            itemDto.totalOut += qty;
                        }
                    }
                }

                // calculate closing balance
                foreach (var item in inventoryItems)
                {
                    item.closingBalance = item.openingBalance + item.totalIn - item.totalOut;
                }

                if (inventoryItems != null && inventoryItems.Any())
                {
                    AddResponseMessage(Response, LogMessages.StockReportRetrieved, inventoryItems, true, HttpStatusCode.OK);
                }
                else
                {
                    AddResponseMessage(Response, LogMessages.StockReportNotFound, new List<StockReportDto>(), true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("CollectionReport/{userId}")]
        public async Task<ApiResponseModel> CollectionReport(int userId, [FromQuery] DateTime date, [FromQuery] int? cashierSessionId = null)
        {
            try
            {
                var receiptData = await _salesReceiptService.GetSalesReceiptsByUserIdAndDate(userId, date, cashierSessionId);
                var cashierExpenses = await _cashierExpenseOutService.GetCashierExpenseOutsByUserIdDate(date, userId, cashierSessionId);

                var reportItems = new List<CollectionReportItemDto>();
                decimal totalAmount = 0;
                decimal totalCashAmount = 0;
                decimal totalBankTransferAmount = 0;
                decimal totalGiftVoucherAmount = 0;
                decimal totalCashierExpenses = 0;

                var invoiceShortAmounts = new Dictionary<int, decimal>();
                var invoiceExcessAmounts = new Dictionary<int, decimal>();

                if (receiptData != null && receiptData.Any())
                {
                    foreach (var receipt in receiptData)
                    {
                        if (receipt.SalesReceiptSalesInvoices != null && receipt.SalesReceiptSalesInvoices.Any())
                        {
                            foreach (var salesReceiptInvoice in receipt.SalesReceiptSalesInvoices)
                            {
                                var item = new CollectionReportItemDto
                                {
                                    Date = receipt.ReceiptDate,
                                    BillNo = receipt.ReferenceNumber,
                                    InvoiceReference = salesReceiptInvoice.SalesInvoice?.ReferenceNo,
                                    ChannelNo = salesReceiptInvoice.SalesInvoice?.TokenNo,
                                    PatientName = salesReceiptInvoice.SalesInvoice?.InVoicedPersonName,
                                    Amount = salesReceiptInvoice.AmountCollect ?? 0,
                                    ShortAmount = salesReceiptInvoice.OutstandingAmount ?? 0,
                                    ExcessAmount = salesReceiptInvoice.ExcessAmount ?? 0,
                                    TelephoneNo = salesReceiptInvoice.SalesInvoice?.InVoicedPersonMobileNo,
                                    User = receipt.CreatedBy,
                                    EnteredTime = receipt.CreatedDate,
                                    ModeOfPayment = receipt.PaymentMode?.Mode
                                };

                                reportItems.Add(item);

                                totalAmount += salesReceiptInvoice.AmountCollect ?? 0;

                                if (salesReceiptInvoice.SalesInvoiceId.HasValue)
                                {
                                    invoiceShortAmounts[salesReceiptInvoice.SalesInvoiceId.Value] = salesReceiptInvoice.OutstandingAmount ?? 0;
                                    invoiceExcessAmounts[salesReceiptInvoice.SalesInvoiceId.Value] = salesReceiptInvoice.ExcessAmount ?? 0;
                                }

                                // Sum cash payments
                                if (receipt.PaymentMode?.Mode?.ToLower() == "cash")
                                {
                                    totalCashAmount += salesReceiptInvoice.AmountCollect ?? 0;
                                }

                                // Sum bank transfers
                                if (receipt.PaymentMode?.Mode?.ToLower() == "bank transfer")
                                {
                                    totalBankTransferAmount += salesReceiptInvoice.AmountCollect ?? 0;
                                }

                                // Sum gift vouchers
                                if (receipt.PaymentMode?.Mode?.ToLower() == "gift voucher")
                                {
                                    totalGiftVoucherAmount += salesReceiptInvoice.AmountCollect ?? 0;
                                }
                            }
                        }
                    }
                }

                decimal totalShortAmount = invoiceShortAmounts.Values.Sum();
                decimal totalExcessAmount = invoiceExcessAmounts.Values.Sum();


                if (cashierExpenses != null && cashierExpenses.Any())
                {
                    foreach (var expense in cashierExpenses)
                    {
                        totalCashierExpenses += expense.Amount ?? 0;
                    }
                }

                // Calculate Daily Totals
                decimal dailyTotalAmount = 0;
                decimal dailyTotalCashAmount = 0;
                decimal dailyTotalBankTransferAmount = 0;
                decimal dailyTotalGiftVoucherAmount = 0;
                decimal dailyTotalCashierExpenses = 0;

                var dailyInvoiceShortAmounts = new Dictionary<int, decimal>();
                var dailyInvoiceExcessAmounts = new Dictionary<int, decimal>();

                decimal dailyTotalShortAmount = 0;
                decimal dailyTotalExcessAmount = 0;

                if (cashierSessionId.HasValue)
                {
                    // Fetch full day data if filtered by session
                    var dailyReceiptData = await _salesReceiptService.GetSalesReceiptsByUserIdAndDate(userId, date, null);
                    var dailyCashierExpenses = await _cashierExpenseOutService.GetCashierExpenseOutsByUserIdDate(date, userId, null);

                    if (dailyReceiptData != null && dailyReceiptData.Any())
                    {
                        foreach (var receipt in dailyReceiptData)
                        {
                            if (receipt.SalesReceiptSalesInvoices != null && receipt.SalesReceiptSalesInvoices.Any())
                            {
                                foreach (var salesReceiptInvoice in receipt.SalesReceiptSalesInvoices)
                                {
                                    dailyTotalAmount += salesReceiptInvoice.AmountCollect ?? 0;

                                    if (salesReceiptInvoice.SalesInvoiceId.HasValue)
                                    {
                                        dailyInvoiceShortAmounts[salesReceiptInvoice.SalesInvoiceId.Value] = salesReceiptInvoice.OutstandingAmount ?? 0;
                                        dailyInvoiceExcessAmounts[salesReceiptInvoice.SalesInvoiceId.Value] = salesReceiptInvoice.ExcessAmount ?? 0;
                                    }

                                    if (receipt.PaymentMode?.Mode?.ToLower() == "cash")
                                    {
                                        dailyTotalCashAmount += salesReceiptInvoice.AmountCollect ?? 0;
                                    }

                                    if (receipt.PaymentMode?.Mode?.ToLower() == "bank transfer")
                                    {
                                        dailyTotalBankTransferAmount += salesReceiptInvoice.AmountCollect ?? 0;
                                    }

                                    if (receipt.PaymentMode?.Mode?.ToLower() == "gift voucher")
                                    {
                                        dailyTotalGiftVoucherAmount += salesReceiptInvoice.AmountCollect ?? 0;
                                    }

                                }
                            }
                        }
                    }

                    dailyTotalShortAmount = dailyInvoiceShortAmounts.Values.Sum();
                    dailyTotalExcessAmount = dailyInvoiceExcessAmounts.Values.Sum();

                    if (dailyCashierExpenses != null && dailyCashierExpenses.Any())
                    {
                        foreach (var expense in dailyCashierExpenses)
                        {
                            dailyTotalCashierExpenses += expense.Amount ?? 0;
                        }
                    }
                }
            else
            {
                // If no session filter, daily totals equal session totals
                dailyTotalAmount = totalAmount;
                dailyTotalShortAmount = totalShortAmount;
                dailyTotalExcessAmount = totalExcessAmount;
                dailyTotalCashAmount = totalCashAmount;
                dailyTotalBankTransferAmount = totalBankTransferAmount;
                dailyTotalGiftVoucherAmount = totalGiftVoucherAmount;
                dailyTotalCashierExpenses = totalCashierExpenses;
            }

                var reportData = new CollectionReportDto
                {
                    Items = reportItems,
                    TotalAmount = totalAmount,
                    TotalShortAmount = totalShortAmount,
                    TotalExcessAmount = totalExcessAmount,
                    TotalCashCollection = totalCashAmount,
                    TotalBankTransferAmount = totalBankTransferAmount,
                    TotalGiftVoucherAmount = totalGiftVoucherAmount,
                    TotalCashInHand = totalCashAmount,
                    TotalCashierExpenseOutAmount = totalCashierExpenses,
                    TotalCashInHandAmount = totalCashAmount - totalCashierExpenses,

                    DailyTotalAmount = dailyTotalAmount,
                    DailyTotalShortAmount = dailyTotalShortAmount,
                    DailyTotalExcessAmount = dailyTotalExcessAmount,
                    DailyTotalCashCollection = dailyTotalCashAmount,
                    DailyTotalCashInHand = dailyTotalCashAmount,
                    DailyTotalBankTransferAmount = dailyTotalBankTransferAmount,
                    DailyTotalGiftVoucherAmount = dailyTotalGiftVoucherAmount,
                    DailyTotalCashierExpenseOutAmount = dailyTotalCashierExpenses,
                    DailyTotalCashInHandAmount = dailyTotalCashAmount - dailyTotalCashierExpenses
                };

                AddResponseMessage(Response, "Collection report retrived", reportData, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("ManagerCollectionReport")]
        public async Task<ApiResponseModel> ManagerCollectionReport([FromQuery] DateTime date)
        {
            try
            {
                var allReceipts = await _salesReceiptService.GetSalesReceiptsByDate(date);
                var users = allReceipts.Select(r => new { r.CreatedUserId, r.CreatedBy }).DistinctBy(u => u.CreatedUserId).ToList();

                var reportDto = new ManagerCollectionReportDto
                {
                    Date = date
                };

                foreach (var user in users)
                {
                    if (user.CreatedUserId == null) continue;

                    int userId = user.CreatedUserId.Value;
                    var userReceipts = allReceipts.Where(r => r.CreatedUserId == userId).ToList();
                    var userExpenses = await _cashierExpenseOutService.GetCashierExpenseOutsByUserIdDate(date, userId);

                    var userDto = new ManagerCollectionReportUserDto
                    {
                        UserId = userId,
                        UserName = user.CreatedBy
                    };

                    // distinct sessions from both receipts, expenses, and the sessions table itself
                    var receiptSessionIds = userReceipts.Select(r => r.CashierSessionId).Distinct();
                    var expenseSessionIds = userExpenses?.Select(e => e.CashierSessionId).Distinct() ?? Enumerable.Empty<int?>();
                    var userSessions = await _cashierSessionService.GetCashierSessionsByUserIdAndDate(userId, date);
                    var userSessionIds = userSessions.Select(cs => (int?)cs.CashierSessionId);
                    
                    var allSessionIds = receiptSessionIds.Union(expenseSessionIds).Union(userSessionIds).Distinct().OrderBy(id => id).ToList();

                    var userInvoiceShortAmounts = new Dictionary<int, decimal>();
                    var userInvoiceExcessAmounts = new Dictionary<int, decimal>();

                    foreach (var sessionId in allSessionIds)
                    {
                        var sessionReceipts = userReceipts.Where(r => r.CashierSessionId == sessionId).ToList();
                        var sessionExpenses = userExpenses?.Where(e => e.CashierSessionId == sessionId).ToList();
                        
                        var sessionDto = new ManagerCollectionReportSessionDto { SessionId = sessionId };

                        if (sessionId.HasValue)
                        {
                            var session = userSessions.FirstOrDefault(cs => cs.CashierSessionId == sessionId.Value) 
                                          ?? await _cashierSessionService.GetCashierSessionByCashierSessionId(sessionId.Value);
                            if (session != null)
                            {
                                sessionDto.SessionIn = session.SessionIn;
                            }
                        }

                        var sessionInvoiceShortAmounts = new Dictionary<int, decimal>();
                        var sessionInvoiceExcessAmounts = new Dictionary<int, decimal>();

                        // Calculate receipt totals
                        foreach (var receipt in sessionReceipts)
                        {
                            if (receipt.SalesReceiptSalesInvoices != null)
                            {
                                foreach (var inv in receipt.SalesReceiptSalesInvoices)
                                {
                                    sessionDto.SessionTotalAmount += inv.AmountCollect ?? 0;

                                    if (inv.SalesInvoiceId.HasValue)
                                    {
                                        sessionInvoiceShortAmounts[inv.SalesInvoiceId.Value] = inv.OutstandingAmount ?? 0;
                                        sessionInvoiceExcessAmounts[inv.SalesInvoiceId.Value] = inv.ExcessAmount ?? 0;

                                        // Also track for user total (latest across all sessions of this user)
                                        userInvoiceShortAmounts[inv.SalesInvoiceId.Value] = inv.OutstandingAmount ?? 0;
                                        userInvoiceExcessAmounts[inv.SalesInvoiceId.Value] = inv.ExcessAmount ?? 0;
                                    }

                                    if (receipt.PaymentMode?.Mode?.ToLower() == "cash")
                                    {
                                        sessionDto.SessionTotalCash += inv.AmountCollect ?? 0;
                                    }

                                    if (receipt.PaymentMode?.Mode?.ToLower() == "bank transfer")
                                    {
                                        sessionDto.SessionTotalBankTransfer += inv.AmountCollect ?? 0;
                                    }

                                    if (receipt.PaymentMode?.Mode?.ToLower() == "gift voucher")
                                    {
                                        sessionDto.SessionTotalGiftVoucher += inv.AmountCollect ?? 0;
                                    }
                                }
                            }
                        }

                        sessionDto.SessionTotalShort = sessionInvoiceShortAmounts.Values.Sum();
                        sessionDto.SessionTotalExcess = sessionInvoiceExcessAmounts.Values.Sum();

                        // Calculate expense totals
                        if (sessionExpenses != null)
                        {
                            sessionDto.SessionTotalExpenses = sessionExpenses.Sum(e => e.Amount ?? 0);
                        }

                        sessionDto.SessionTotalCashInHand = sessionDto.SessionTotalCash - sessionDto.SessionTotalExpenses;

                        userDto.Sessions.Add(sessionDto);

                        // Add to user totals
                        userDto.UserTotalAmount += sessionDto.SessionTotalAmount;
                        userDto.UserTotalCash += sessionDto.SessionTotalCash;
                        userDto.UserTotalBankTransfer += sessionDto.SessionTotalBankTransfer;
                        userDto.UserTotalGiftVoucher += sessionDto.SessionTotalGiftVoucher;
                        userDto.UserTotalExpenses += sessionDto.SessionTotalExpenses;
                        userDto.UserTotalCashInHand += sessionDto.SessionTotalCashInHand;
                    }

                    userDto.UserTotalShort = userInvoiceShortAmounts.Values.Sum();
                    userDto.UserTotalExcess = userInvoiceExcessAmounts.Values.Sum();

                    if (userDto.Sessions.Any())
                    {
                        reportDto.UserReports.Add(userDto);

                        // Add to grand totals
                        reportDto.TotalAmount += userDto.UserTotalAmount;
                        reportDto.TotalCash += userDto.UserTotalCash;
                        reportDto.TotalBankTransfer += userDto.UserTotalBankTransfer;
                        reportDto.TotalGiftVoucher += userDto.UserTotalGiftVoucher;
                        reportDto.TotalExpenses += userDto.UserTotalExpenses;
                        reportDto.TotalCashInHand += userDto.UserTotalCashInHand;
                    }
                }

                // Calculate Grand Totals for Short/Excess across all users for the day
                var grandInvoiceShortAmounts = new Dictionary<int, decimal>();
                var grandInvoiceExcessAmounts = new Dictionary<int, decimal>();

                foreach (var receipt in allReceipts)
                {
                    if (receipt.SalesReceiptSalesInvoices != null)
                    {
                        foreach (var inv in receipt.SalesReceiptSalesInvoices)
                        {
                            if (inv.SalesInvoiceId.HasValue)
                            {
                                grandInvoiceShortAmounts[inv.SalesInvoiceId.Value] = inv.OutstandingAmount ?? 0;
                                grandInvoiceExcessAmounts[inv.SalesInvoiceId.Value] = inv.ExcessAmount ?? 0;
                            }
                        }
                    }
                }

                reportDto.TotalShort = grandInvoiceShortAmounts.Values.Sum();
                reportDto.TotalExcess = grandInvoiceExcessAmounts.Values.Sum();

                AddResponseMessage(Response, "Manager Collection Report Retrieved", reportDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetCustomerInvoices")]
        public async Task<ApiResponseModel> GetCustomerInvoices(
            [FromQuery] string? name = null,
            [FromQuery] string? phone = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _salesInvoiceService.GetSalesInvoicesByCustomerSearch(name, phone, fromDate, toDate, pageNumber, pageSize);
                if (result.Items.Any())
                {
                    var customerInvoiceDtos = _mapper.Map<IEnumerable<CustomerInvoiceDto>>(result.Items);

                    var responseData = new
                    {
                        Data = customerInvoiceDtos,
                        Pagination = new
                        {
                            result.TotalCount,
                            result.PageNumber,
                            result.PageSize,
                            result.TotalPages,
                            result.HasPreviousPage,
                            result.HasNextPage
                        }
                    };

                    AddResponseMessage(Response, LogMessages.SalesInvoicesRetrieved, responseData, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesInvoicesNotFound);
                    AddResponseMessage(Response, LogMessages.SalesInvoicesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }
        [HttpGet("InvoiceReport")]
        public async Task<ApiResponseModel> InvoiceReport([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate, [FromQuery] string? filter = null)
        {
            try
            {
                var result = await _salesInvoiceService.GetSalesInvoicesForReport(fromDate, toDate, filter);
                
                var reportItems = new List<InvoiceReportDto>();

                if (result.Items != null && result.Items.Any())
                {
                    foreach (var invoice in result.Items)
                    {
                        if (invoice.SalesReceiptSalesInvoices != null && invoice.SalesReceiptSalesInvoices.Any())
                        {
                            foreach (var receiptMapping in invoice.SalesReceiptSalesInvoices)
                            {
                                var receipt = receiptMapping.SalesReceipt;
                                if (receipt != null)
                                {
                                    reportItems.Add(new InvoiceReportDto
                                    {
                                        SalesInvoiceId = invoice.SalesInvoiceId,
                                        InvoiceNo = invoice.ReferenceNo,
                                        CustomerName = invoice.InVoicedPersonName ?? invoice.SalesOrder?.Customer?.CustomerName,
                                        InvoiceStatus = invoice.Status,
                                        InvoiceAmount = invoice.TotalAmount,
                                        
                                        ReceiptNumber = receipt.ReferenceNumber,
                                        ReceiptAmount = receiptMapping.AmountCollect,
                                        PaymentMode = receipt.PaymentMode?.Mode,
                                        ReceiptStatus = receipt.Status,
                                        ReceiptDate = receipt.ReceiptDate,
                                        ExcessAmount = receiptMapping.ExcessAmount,
                                        DueAmount = receiptMapping.OutstandingAmount
                                    });
                                }
                            }
                        }
                        else
                        {
                            // Invoice with no receipts
                            reportItems.Add(new InvoiceReportDto
                            {
                                SalesInvoiceId = invoice.SalesInvoiceId,
                                InvoiceNo = invoice.ReferenceNo,
                                CustomerName = invoice.InVoicedPersonName ?? invoice.SalesOrder?.Customer?.CustomerName,
                                InvoiceStatus = invoice.Status,
                                InvoiceAmount = invoice.AmountDue, 
                                
                                ReceiptNumber = "-",
                                ReceiptAmount = 0,
                                PaymentMode = "-",
                                ReceiptStatus = null,
                                ReceiptDate = null,
                                ExcessAmount = 0,
                                DueAmount = invoice.AmountDue
                            });
                        }
                    }
                }

                if (reportItems.Any())
                {
                    AddResponseMessage(Response, "Invoice report retrieved", reportItems, true, HttpStatusCode.OK);
                }
                else
                {
                    AddResponseMessage(Response, "No records found", new List<InvoiceReportDto>(), true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }
    }
}
