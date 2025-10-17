using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/itemPriceMaster")]
    public class ItemPriceMasterController : BaseApiController
    {
        private readonly IItemPriceMasterService _itemPriceMasterService;
        private readonly ILogger<ItemPriceMasterController> _logger;
        private readonly IMapper _mapper;

        public ItemPriceMasterController(IItemPriceMasterService itemPriceMasterService, ILogger<ItemPriceMasterController> logger, IMapper mapper)
        {
            _itemPriceMasterService = itemPriceMasterService;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddItemPriceMaster(ItemPriceMasterRequestModel requestModel)
        {
            try
            {
                var ItemPriceMaster = _mapper.Map<ItemPriceMaster>(requestModel);
                await _itemPriceMasterService.AddItemPriceMaster(ItemPriceMaster);

                // send response
                var ItemPriceMasterDto = _mapper.Map<ItemPriceMasterDto>(ItemPriceMaster);
                _logger.LogInformation(LogMessages.ItemPriceMasterCreated);
                AddResponseMessage(Response, LogMessages.ItemPriceMasterCreated, ItemPriceMasterDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{id}")]
        public async Task<ApiResponseModel> GetItemPriceMasterById(int id)
        {
            try
            {
                var itemPriceMaster = await _itemPriceMasterService.GetItemPriceMasterById(id);
                if (itemPriceMaster == null)
                {
                    _logger.LogWarning(LogMessages.ItemPriceMasterNotFound);
                    AddResponseMessage(Response, LogMessages.ItemPriceMasterNotFound, null, false, HttpStatusCode.NotFound);
                }
                else
                {
                    var itemPriceMasterDto = _mapper.Map<ItemPriceMasterDto>(itemPriceMaster);
                    _logger.LogInformation(LogMessages.ItemPriceMasterRetrived);
                    AddResponseMessage(Response, LogMessages.ItemPriceMasterRetrived, itemPriceMasterDto, true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemPriceMasterByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetItemPriceMasterByCompanyId(int companyId)
        {
            try
            {
                var itemPriceMasters = await _itemPriceMasterService.GetItemPriceMasterByCompanyId(companyId);
                if (itemPriceMasters.Any())
                {
                    var itemPriceMasterDto = _mapper.Map<IEnumerable<ItemPriceMasterDto>>(itemPriceMasters);
                    _logger.LogInformation(LogMessages.ItemPriceMasterRetrived);
                    AddResponseMessage(Response, LogMessages.ItemPriceMasterRetrived, itemPriceMasterDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogInformation(LogMessages.ItemPriceMasterNotFound);
                    AddResponseMessage(Response, LogMessages.ItemPriceMasterNotFound, null, true, HttpStatusCode.NotFound);
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
