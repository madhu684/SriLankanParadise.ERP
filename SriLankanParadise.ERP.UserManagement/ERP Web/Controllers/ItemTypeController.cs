using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/itemType")]
    public class ItemTypeController : BaseApiController
    {
        private readonly IItemTypeService _itemTypeService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ItemTypeController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ItemTypeController(
            IItemTypeService itemTypeService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ItemTypeController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _itemTypeService = itemTypeService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }


        [HttpPost]
        public async Task<ApiResponseModel> AddItemType(ItemTypeRequestModel itemTypeRequestModel)
        {
            try
            {
                var itemType = _mapper.Map<ItemType>(itemTypeRequestModel);
                await _itemTypeService.AddItemType(itemType);

                var itemTypeDto = _mapper.Map<ItemTypeDto>(itemType);
                _logger.LogInformation(LogMessages.ItemTypeAdded);
                AddResponseMessage(Response, LogMessages.ItemTypeAdded, itemTypeDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemTypesByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetItemTypesByCompanyId(int companyId)
        {
            try
            {
                var itemTypes = await _itemTypeService.GetItemTypesByCompanyId(companyId);
                if (itemTypes != null)
                {
                    var itemTypeDtos = _mapper.Map<IEnumerable<ItemTypeDto>>(itemTypes);
                    AddResponseMessage(Response, LogMessages.ItemTypesRetrieved, itemTypeDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemTypesNotFound);
                    AddResponseMessage(Response, LogMessages.ItemTypesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{id}")]
        public async Task<ApiResponseModel> GetItemTypeById(int id)
        {
            try
            {
                var itemType = await _itemTypeService.GetItemTypeById(id);
                if (itemType != null)
                {
                    var itemTypeDto = _mapper.Map<ItemTypeDto>(itemType);
                    _logger.LogInformation(LogMessages.ItemTypeRetrieved);
                    AddResponseMessage(Response, LogMessages.ItemTypeRetrieved, itemTypeDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemTypeNotFound);
                    AddResponseMessage(Response, LogMessages.ItemTypeNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;

        }

        [HttpPut("{id}")]
        public async Task<ApiResponseModel> UpdateItemType(int id, ItemTypeRequestModel itemTypeRequestModel)
        {
            try
            {
                var existingItemType = await _itemTypeService.GetItemTypeById(id);
                if (existingItemType == null)
                {
                    _logger.LogWarning(LogMessages.ItemTypeNotFound);
                    AddResponseMessage(Response, LogMessages.ItemTypeNotFound, null, true, HttpStatusCode.NotFound);
                    return Response;
                }

                var updatedItemType = _mapper.Map<ItemType>(itemTypeRequestModel);
                updatedItemType.ItemTypeId = id;

                await _itemTypeService.UpdateItemType(existingItemType.ItemTypeId, updatedItemType);

                _logger.LogInformation(LogMessages.ItemTypeUpdated);
                AddResponseMessage(Response, LogMessages.ItemTypeUpdated, null, true, HttpStatusCode.OK);
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
