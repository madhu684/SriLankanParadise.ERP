﻿using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryReportController : BaseApiController
    {
        private readonly IDailyLocationInventoryService dailyLocationInventoryService;
        private readonly ILocationInventoryMovementService locationInventoryMovementService;
        private readonly ILocationInventoryService locationInventoryService;
        private readonly IItemMasterService itemMasterService;
        private readonly ILocationService locationService;
        private readonly IMapper mapper;
        private readonly ILogger<InventoryReportController> logger;

        public InventoryReportController(
            IDailyLocationInventoryService dailyLocationInventoryService,
            ILocationInventoryMovementService locationInventoryMovementService,
            ILocationInventoryService locationInventoryService,
            IItemMasterService itemMasterService,
            ILocationService locationService,
            IMapper mapper,
            ILogger<InventoryReportController> logger
        )
        {
            this.dailyLocationInventoryService = dailyLocationInventoryService;
            this.locationInventoryMovementService = locationInventoryMovementService;
            this.locationInventoryService = locationInventoryService;
            this.itemMasterService = itemMasterService;
            this.locationService = locationService;
            this.mapper = mapper;
            this.logger = logger;
        }

        [HttpGet("InventoryAnalysisReport/{fromDate}/{toDate}/{locationId}")]
        public async Task<ApiResponseModel> InventoryAnalysisReport([FromRoute] DateTime fromDate, [FromRoute] DateTime toDate, [FromRoute] int locationId)
        {
            try
            {
                var inventoryItems = new List<InventoryItemInfo>(); //all inventory items

                var previousDate = fromDate.AddDays(-1);
                var previousDateOnly = new DateOnly(previousDate.Year, previousDate.Month, previousDate.Day);

                var alreadyStockedItemsLocInv = await dailyLocationInventoryService.Get(previousDateOnly, locationId);
                var in_ItemsLocInv = await locationInventoryMovementService.ByDateRange(fromDate, toDate, locationId, 1);
                var out_ItemsLocInv = await locationInventoryMovementService.ByDateRange(fromDate, toDate, locationId, 2);

                // add already stocked items on selecting fromDate (Inventory Up)
                if (alreadyStockedItemsLocInv != null && alreadyStockedItemsLocInv.Any())
                {
                    foreach (var item in alreadyStockedItemsLocInv)
                    {

                        inventoryItems.Add(new InventoryItemInfo
                        {
                            itemId = item.ItemMasterId,
                            batchNumber = item.BatchNo,
                            location = item.Location?.LocationName,
                            ItemMaster = item.ItemMaster,
                            openingBalance = item.StockInHand ?? 0,
                            receivedQty = 0,
                            actualUsage = 0,
                            closingBalance = 0
                        });
                    }
                }

                // add incoming items (Inventory Up)
                if (in_ItemsLocInv != null && in_ItemsLocInv.Any())
                {
                    foreach (var in_Item in in_ItemsLocInv)
                    {
                        // already stocked items
                        if(inventoryItems.Any(i => i.itemId == in_Item.ItemMasterId && i.batchNumber == in_Item.BatchNo))
                        {
                            var index = inventoryItems.FindIndex(i => i.itemId == in_Item.ItemMasterId && i.batchNumber == in_Item.BatchNo);
                            inventoryItems[index].receivedQty += in_Item.Qty ?? 0;
                            inventoryItems[index].GRNQty += in_Item.GRNQty ?? 0;
                            inventoryItems[index].ProductionInQty += in_Item.ProductionInQty ?? 0;
                            inventoryItems[index].ReturnInQty += in_Item.ReturnInQty ?? 0;
                        }
                        // new items
                        else
                        {
                            var itemMaster = await itemMasterService.GetItemMasterByItemMasterId(in_Item.ItemMasterId);
                            var location = await locationService.GetLocationByLocationId(in_Item.LocationId);

                            inventoryItems.Add(new InventoryItemInfo
                            {
                                itemId = in_Item.ItemMasterId,
                                batchNumber = in_Item.BatchNo,
                                location = location.LocationName,
                                ItemMaster = itemMaster,
                                openingBalance = 0,
                                receivedQty = in_Item.Qty ?? 0,
                                actualUsage = 0,
                                closingBalance = 0,
                                GRNQty = in_Item.GRNQty ?? 0,
                                ProductionInQty = in_Item.ProductionInQty ?? 0,
                                ReturnInQty = in_Item.ReturnInQty ?? 0
                            });
                        }
                    }
                }

                // add outgoing items (Inventory Down)
                if (out_ItemsLocInv != null && out_ItemsLocInv.Any())
                {
                    foreach (var out_Item in out_ItemsLocInv)
                    {
                        if (inventoryItems.Any(i => i.itemId == out_Item.ItemMasterId && i.batchNumber == out_Item.BatchNo))
                        {
                            var index = inventoryItems.FindIndex(i => i.itemId == out_Item.ItemMasterId && i.batchNumber == out_Item.BatchNo);
                            inventoryItems[index].actualUsage += out_Item.Qty ?? 0;
                            inventoryItems[index].ProductionOutQty += out_Item.ProductionOutQty ?? 0;
                            inventoryItems[index].ReturnQty += out_Item.ReturnQty ?? 0;
                        }
                    }
                }

                // calculate closing balance
                foreach (var item in inventoryItems)
                {
                    item.closingBalance = item.openingBalance + item.receivedQty - item.actualUsage;
                }

                if (inventoryItems!=null && inventoryItems.Any())
                {
                    var reportData = new List<InventoryReportDto>();

                    foreach (var item in inventoryItems) {
                        var report = new InventoryReportDto
                        {
                            Inventory = item.location,
                            RawMaterial = item.ItemMaster.ItemName,
                            ItemCode = item.ItemMaster.ItemCode,
                            BatchNo = item.batchNumber,
                            UOM = item.ItemMaster.Unit.UnitName,
                            OpeningBalance = item.openingBalance,
                            ReceivedQty = item.receivedQty,
                            ActualUsage = item.actualUsage,
                            ClosingBalance = item.closingBalance,
                            GRNQty = item.GRNQty,
                            ProductionInQty = item.ProductionInQty ,
                            ReturnInQty = item.ReturnInQty,
                            ProductionOutQty =item.ProductionOutQty,
                            ReturnQty = item.ReturnQty
                        };
                        reportData.Add(report);
                    }

                    AddResponseMessage(Response, LogMessages.ReportRetrieved, reportData, true, HttpStatusCode.OK);
                }
                else
                {
                    AddResponseMessage(Response, LogMessages.ReportNoResultFound, new List<InventoryReportDto>(), true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("InventoryAsAtDateReport/{date}/{locationId}")]
        public async Task<ApiResponseModel> InventoryAsAtDateReport([FromRoute] DateTime date, [FromRoute] int locationId)
        {
            try
            {
                var inventoryItems = new List<InventoryItemInfo>(); //all inventory items

                var previousDate = date.AddDays(-1);
                var previousDateOnly = new DateOnly(previousDate.Year, previousDate.Month, previousDate.Day);

                var alreadyStockedItemsLocInv = await dailyLocationInventoryService.Get(previousDateOnly, locationId);

                // add already stocked items on selecting fromDate (Inventory Up)
                if (alreadyStockedItemsLocInv != null && alreadyStockedItemsLocInv.Any())
                {
                    foreach (var item in alreadyStockedItemsLocInv)
                    {

                        inventoryItems.Add(new InventoryItemInfo
                        {
                            itemId = item.ItemMasterId,
                            batchNumber = item.BatchNo,
                            location = item.Location?.LocationName,
                            ItemMaster = item.ItemMaster,
                            openingBalance = item.StockInHand ?? 0,
                            receivedQty = 0,
                            actualUsage = 0,
                            closingBalance = item.StockInHand ?? 0
                        });
                    }
                }

                if (inventoryItems != null && inventoryItems.Any())
                {
                    var reportData = new List<InventoryReportDto>();

                    foreach (var item in inventoryItems)
                    {
                        var report = new InventoryReportDto
                        {
                            Inventory = item.location,
                            RawMaterial = item.ItemMaster.ItemName,
                            ItemCode = item.ItemMaster.ItemCode,
                            BatchNo = item.batchNumber,
                            UOM = item.ItemMaster.Unit.UnitName,
                            OpeningBalance = item.openingBalance,
                            ReceivedQty = item.receivedQty,
                            ActualUsage = item.actualUsage,
                            ClosingBalance = item.closingBalance
                        };
                        reportData.Add(report);
                    }

                    AddResponseMessage(Response, LogMessages.ReportRetrieved, reportData, true, HttpStatusCode.OK);
                }
                else
                {
                    AddResponseMessage(Response, LogMessages.ReportNoResultFound, new List<InventoryReportDto>(), true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        private class InventoryItemInfo
        {
            public int itemId { get; set; }
            public string? batchNumber { get; set; }
            public string? location { get; set; }
            public ItemMaster ItemMaster { get; set; }
            public decimal openingBalance { get; set; }
            public decimal receivedQty { get; set; }
            public decimal actualUsage { get; set; }
            public decimal closingBalance { get; set; }

            public decimal GRNQty { get; set; }
            public decimal ProductionInQty { get; set; }
            public decimal ReturnInQty { get; set; }
            public decimal ProductionOutQty { get; set; }
            public decimal ReturnQty { get; set; }
        }
    }
}
