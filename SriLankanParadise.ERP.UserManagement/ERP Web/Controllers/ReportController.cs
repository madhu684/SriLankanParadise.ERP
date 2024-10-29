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
                var inventoryItemsStartingBalance = await dailyLocationInventoryService.Get(fromDate, locationId);
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
    }
}
