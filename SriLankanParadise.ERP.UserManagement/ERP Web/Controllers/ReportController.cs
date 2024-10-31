using AutoMapper;
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
    public class ReportController : BaseApiController
    {
        private readonly IDailyLocationInventoryService dailyLocationInventoryService;
        private readonly ILocationInventoryMovementService locationInventoryMovementService;
        private readonly ILocationInventoryService locationInventoryService;
        private readonly IMapper mapper;
        private readonly ILogger<DailyLocationInventory> logger;

        public ReportController(
            IDailyLocationInventoryService dailyLocationInventoryService,
            ILocationInventoryMovementService locationInventoryMovementService,
            ILocationInventoryService locationInventoryService,
            IMapper mapper,
            ILogger<DailyLocationInventory> logger
        )
        {
            this.dailyLocationInventoryService = dailyLocationInventoryService;
            this.locationInventoryMovementService = locationInventoryMovementService;
            this.locationInventoryService = locationInventoryService;
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
                var in_ItemsLocInv = await locationInventoryMovementService.ByDateRange(fromDate, toDate);
                var out_ItemsLocInv = await locationInventoryMovementService.ByDateRange(fromDate, toDate);

                // add already stocked items on selecting fromDate 
                if (alreadyStockedItemsLocInv != null && alreadyStockedItemsLocInv.Any())
                {
                    foreach (var item in alreadyStockedItemsLocInv)
                    {
                        inventoryItems.Add(new InventoryItemInfo
                        {
                            itemId = item.ItemMasterId,
                            ItemMaster = item.ItemMaster,
                            startingBalance = item.StockInHand ?? 0,
                            receivedQty = 0,
                            actualUsage = 0,
                            closingBalance = item.StockInHand ?? 0
                        });
                    }
                }

                var locationInventoryMovements = await locationInventoryMovementService.ByDateRange(fromDate, toDate);
                
                if (locationInventoryMovements.Any())
                {
                    var uniqueLocationInventoryMovements = locationInventoryMovements
                        .GroupBy(l => new { l.ItemMasterId, l.BatchNo, l.LocationId })
                        .Select(g => new
                        {
                            g.Key.ItemMasterId,
                            g.Key.BatchNo,
                            g.Key.LocationId,
                            ReceivedQty = g.Sum(l => l.Qty),
                            ActualUsage = g.Sum(l => l.Qty)
                        }).ToList();

                    
                    //var dailyLocationInventoryDto = mapper.Map<DailyLocationInventoryDto>(dailyLocationInventory);
                    //AddResponseMessage(Response, LogMessages.ReportRetrieved, dailyLocationInventoryDto, true, HttpStatusCode.OK);
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
            public ItemMaster ItemMaster { get; set; }
            public decimal startingBalance { get; set; }
            public decimal receivedQty { get; set; }
            public decimal actualUsage { get; set; }
            public decimal closingBalance { get; set; }
        }
    }
}
