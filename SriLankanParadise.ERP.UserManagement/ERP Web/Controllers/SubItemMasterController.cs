using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubItemMasterController : BaseApiController
    {
        private readonly ISubItemMasterService subItemMasterService;
        private readonly IItemMasterService itemMasterService;
        private readonly IMapper mapper;
        private readonly ILogger<SubItemMasterController> logger;

        public SubItemMasterController(ISubItemMasterService subItemMasterService, IItemMasterService itemMasterService, IMapper mapper, ILogger<SubItemMasterController> logger)
        {
            this.subItemMasterService = subItemMasterService;
            this.itemMasterService = itemMasterService;
            this.mapper = mapper;
            this.logger = logger;
        }

        [HttpGet("GetSubItemMastersByItemMasterId/{itemMasterId}")]
        public async Task<ApiResponseModel> GetSubItemMastersByItemMasterId(int itemMasterId)
        {
            try
            {
                var subItemMasters = await subItemMasterService.GetSubItemMastersByItemMasterId(itemMasterId);

                if (subItemMasters.Any())
                {
                    var subItemMasterDtos = mapper.Map<List<SubItemMasterDto>>(subItemMasters);

                    foreach (var subItemMasterDto in subItemMasterDtos)
                    {
                        var subItemMaster = await itemMasterService.GetItemMasterByItemMasterId(subItemMasterDto.SubItemMasterId);
                        subItemMasterDto.SubItemMaster = mapper.Map<ItemMasterDto>(subItemMaster);
                    }

                    AddResponseMessage(Response, LogMessages.SubItemsRetrieved, subItemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    AddResponseMessage(Response, LogMessages.SubItemsNotFound, subItemMasters, true, HttpStatusCode.NotFound);
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
