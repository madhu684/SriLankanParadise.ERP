using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DailyLocationInventoryController : BaseApiController
    {
        private readonly IDailyLocationInventoryService dailyLocationInventoryService;
        private readonly IMapper mapper;
        private readonly ILogger<DailyLocationInventory> logger;

        public DailyLocationInventoryController(
            IDailyLocationInventoryService dailyLocationInventoryService,
            IMapper mapper,
            ILogger<DailyLocationInventory> logger)
        {
            this.dailyLocationInventoryService = dailyLocationInventoryService;
            this.mapper = mapper;
            this.logger = logger;
        }

        [HttpPost()]
        public async Task<ApiResponseModel> Get([FromBody] DailyLocationInventoryRequestModel dailyLocationInventoryRequest)
        {
            try
            {
                var dailyLocationInventory = mapper.Map<DailyLocationInventory>(dailyLocationInventoryRequest);
                await dailyLocationInventoryService.Add(dailyLocationInventory);

                var dailyLocationInventoryDto = mapper.Map<DailyLocationInventoryDto>(dailyLocationInventory);
                logger.LogInformation(LogMessages.DailyLocationInventoryCreated);
                AddResponseMessage(Response, LogMessages.DailyLocationInventoryCreated, dailyLocationInventoryDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }
        
        [HttpGet("{runDate}/{locationId}")]
        public async Task<ApiResponseModel> Get([FromRoute] DateOnly runDate, [FromRoute] int locationId)
        {
            try
            {
                var dailyLocationInventories = await dailyLocationInventoryService.Get(runDate, locationId);
                if (dailyLocationInventories != null)
                {
                    var dailyLocationInventoriesDto = mapper.Map<IEnumerable<DailyLocationInventoryDto>>(dailyLocationInventories);
                    AddResponseMessage(Response, LogMessages.DailyLocationInventoriesRetrieved, dailyLocationInventoriesDto, true, HttpStatusCode.OK);
                }
                else
                {
                    logger.LogWarning(LogMessages.DailyLocationInventoriesNotFound);
                    AddResponseMessage(Response, LogMessages.DailyLocationInventoriesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{runDate}/{itemMasterId}/{batchNo}/{locationId}")]
        public async Task<ApiResponseModel> Get([FromRoute] DateOnly runDate, [FromRoute] int itemMasterId, [FromRoute] string batchNo, [FromRoute] int locationId)
        {
            try
            {
                var dailyLocationInventory = await dailyLocationInventoryService.Get(runDate, itemMasterId, batchNo, locationId);
                if (dailyLocationInventory != null)
                {
                    var dailyLocationInventoryDto = mapper.Map<DailyLocationInventoryDto>(dailyLocationInventory);
                    AddResponseMessage(Response, LogMessages.DailyLocationInventoryRetrieved, dailyLocationInventoryDto, true, HttpStatusCode.OK);
                }
                else
                {
                    logger.LogWarning(LogMessages.DailyLocationInventoryNotFound);
                    AddResponseMessage(Response, LogMessages.DailyLocationInventoryNotFound, null, true, HttpStatusCode.NotFound);
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
