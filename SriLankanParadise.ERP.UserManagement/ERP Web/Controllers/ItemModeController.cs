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
    [Route("api/itemMode")]
    [ApiController]
    public class ItemModeController : BaseApiController
    {
        private readonly IItemModeService _itemModeService;
        private readonly ILogger<ItemModeController> _logger;
        private readonly IMapper _mapper;

        public ItemModeController(IItemModeService itemModeService, ILogger<ItemModeController> logger, IMapper mapper)
        {
            _itemModeService = itemModeService;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet("GetAll")]
        public async Task<ApiResponseModel> GetAllItemModes()
        {
            try
            {
                var itemModes = await _itemModeService.GetAllItemModesAsync();
                if (itemModes != null && itemModes.Any())
                {
                    var itemModeDtos = _mapper.Map<IEnumerable<ItemModeDto>>(itemModes);
                    _logger.LogInformation(LogMessages.ItemModesRetrived);
                    AddResponseMessage(Response, LogMessages.ItemModesRetrived, itemModeDtos, true, HttpStatusCode.OK);

                }
                else
                {
                    AddResponseMessage(Response, LogMessages.ItemModesNotFound, null, false, HttpStatusCode.NotFound);
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
