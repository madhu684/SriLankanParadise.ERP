using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Collections.Generic;
using System.Globalization;
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

                var in_ItemsLocInv = await _locationInventoryMovementService.ByDateRangeLocationIdMovementTypeId(fromDate, toDate, locationId, 1);
                var out_ItemsLocInv = await _locationInventoryMovementService.ByDateRangeLocationIdMovementTypeId(fromDate, toDate, locationId, 2);

                if (alreadyStockedItemsLocInv != null && alreadyStockedItemsLocInv.Any())
                {
                    foreach (var item in alreadyStockedItemsLocInv)
                    {
                        var location = await _locationService.GetLocationByLocationId(item.LocationId);

                        inventoryItems.Add(new StockReportDto
                        {
                            itemId = item.ItemMasterId,
                            batchId = item.BatchId,
                            batchNumber = item.Batch?.BatchRef ?? "-",
                            location = location?.LocationName ?? "-",
                            itemName = item.ItemMaster?.ItemName ?? "-",
                            itemCode = item.ItemMaster?.ItemCode ?? "-",
                            unitName = item.ItemMaster?.Unit?.UnitName ?? "-",
                            reorderLevel = item.ItemMaster?.ReorderLevel ?? 0,
                            openingBalance = item.StockInHand ?? 0,
                            totalIn = 0,
                            totalOut = 0,
                            closingBalance = 0
                        });
                    }
                }


                if (in_ItemsLocInv != null && in_ItemsLocInv.Any())
                {
                    foreach (var in_Item in in_ItemsLocInv)
                    {
                        if(inventoryItems.Any(i => i.itemId == in_Item.ItemMasterId && in_Item.BatchId == i.batchId))
                        {
                            var index = inventoryItems.FindIndex(i => i.itemId == in_Item.ItemMasterId && in_Item.BatchId == i.batchId);
                            inventoryItems[index].totalIn += in_Item.Qty ?? 0;
                        }
                        else
                        {
                            var itemMaster = await _itemMasterService.GetItemMasterByItemMasterId(in_Item.ItemMasterId);
                            var location = await _locationService.GetLocationByLocationId(in_Item.LocationId);

                            inventoryItems.Add(new StockReportDto
                            {
                                itemId = in_Item.ItemMasterId,
                                batchId = in_Item.BatchId,
                                batchNumber = in_Item.Batch?.BatchRef ?? "-",
                                location = location.LocationName ?? "-",
                                itemName = itemMaster.ItemName ?? "-",
                                itemCode = itemMaster.ItemCode ?? "-",
                                unitName = itemMaster.Unit?.UnitName ?? "-",
                                reorderLevel = itemMaster.ReorderLevel ?? 0,
                                openingBalance = 0,
                                totalIn = in_Item.Qty ?? 0,
                                totalOut = 0,
                                closingBalance = 0
                            });
                        }
                    }
                }

                if (out_ItemsLocInv != null && out_ItemsLocInv.Any())
                {
                    foreach (var out_Item in out_ItemsLocInv)
                    {
                        if (inventoryItems.Any(i => i.itemId == out_Item.ItemMasterId && out_Item.BatchId == i.batchId))
                        {
                            var index = inventoryItems.FindIndex(i => i.itemId == out_Item.ItemMasterId && out_Item.BatchId == i.batchId);
                            inventoryItems[index].totalOut += out_Item.Qty ?? 0;
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
                    var reportData = new List<StockReportDto>();

                    foreach (var item in inventoryItems)
                    {
                        var report = new StockReportDto
                        {
                            itemId = item.itemId,
                            batchId = item.batchId,
                            batchNumber = item.batchNumber,
                            location = item.location,
                            itemName = item.itemName,
                            itemCode = item.itemCode,
                            unitName = item.unitName,
                            reorderLevel = item.reorderLevel,
                            openingBalance = item.openingBalance,
                            totalIn = item.totalIn,
                            totalOut = item.totalOut,
                            closingBalance = item.closingBalance
                        };
                        reportData.Add(report);
                    }

                    if (reportData.Any())
                    {
                        AddResponseMessage(Response, LogMessages.StockReportRetrieved, reportData, true, HttpStatusCode.OK);
                    }
                    else
                    {
                        AddResponseMessage(Response, LogMessages.StockReportNotFound, new List<StockReportDto>(), true, HttpStatusCode.OK);
                    }
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

        [HttpGet("GetSalesReportByDateRange")]
        public async Task<ApiResponseModel> GetSalesReportByDateRange(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate,
            [FromQuery] int? customerId = null,
            [FromQuery] int? regionId = null,
            [FromQuery] int? salesPersonId = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _salesInvoiceService.GetSalesInvoiceByDateRange(
                    fromDate, toDate, customerId, regionId, salesPersonId,
                    pageNumber, pageSize);

                if (result.Items.Any())
                {
                    var dtos = _mapper.Map<IEnumerable<SalesInvoiceDto>>(result.Items);
                    var responseData = new
                    {
                        Data = dtos,
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

                    AddResponseMessage(Response, "Sales report retrieved successfully", responseData, true, HttpStatusCode.OK);
                }
                else
                {
                    AddResponseMessage(Response, "No records found", null, true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetSalesReportByDateRange");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }
    }
}
