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
    [Route("api/itemPriceDetail")]
    public class ItemPriceDetailController : BaseApiController
    {
        private readonly IItemPriceDetailService _itemPriceDetailService;
        private readonly ILogger<ItemPriceDetailController> _logger;
        private readonly IMapper _mapper;

        public ItemPriceDetailController(IItemPriceDetailService itemPriceDetailService, ILogger<ItemPriceDetailController> logger, IMapper mapper)
        {
            _itemPriceDetailService = itemPriceDetailService;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddItemPriceDetail(ItemPriceDetailRequestModel requestModel)
        {
            try
            {
                var itemPriceDetail = _mapper.Map<ItemPriceDetail>(requestModel);
                await _itemPriceDetailService.AddItemPriceDetail(itemPriceDetail);

                // send response
                var itemPriceDetailDto = _mapper.Map<ItemPriceDetailDto>(itemPriceDetail);
                _logger.LogInformation(LogMessages.ItemPriceDetailCreated);
                AddResponseMessage(Response, LogMessages.ItemPriceDetailCreated, itemPriceDetailDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Internal server error.");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{id}")]
        public async Task<ApiResponseModel> GetItemPriceDetailById(int id)
        {
            try
            {
                var itemPriceDetail = await _itemPriceDetailService.GetById(id);
                if (itemPriceDetail == null)
                {
                    _logger.LogWarning(LogMessages.ItemPriceDetailNotFound);
                    AddResponseMessage(Response, LogMessages.ItemPriceDetailNotFound, null, false, HttpStatusCode.NotFound);
                }
                else
                {
                    var itemPriceDetailDto = _mapper.Map<ItemPriceDetailDto>(itemPriceDetail);
                    AddResponseMessage(Response, LogMessages.ItemPriceDetailRetrived, itemPriceDetailDto, true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetByItemPriceMasterId/{itemPriceMasterId}")]
        public async Task<ApiResponseModel> GetByItemPriceMasterId(int itemPriceMasterId)
        {
            try
            {
                var itemPriceDetails = await _itemPriceDetailService.GetByItemPriceMasterId(itemPriceMasterId);
                if (itemPriceDetails.Any())
                {
                    var itemPriceDetailDtos = _mapper.Map<IEnumerable<ItemPriceDetailDto>>(itemPriceDetails);
                    _logger.LogInformation(LogMessages.ItemPriceDetailRetrived);
                    AddResponseMessage(Response, LogMessages.ItemPriceDetailRetrived, itemPriceDetailDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogError(LogMessages.ItemPriceDetailNotFound);
                    AddResponseMessage(Response, LogMessages.ItemPriceDetailNotFound, null, false, HttpStatusCode.NotFound);
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
