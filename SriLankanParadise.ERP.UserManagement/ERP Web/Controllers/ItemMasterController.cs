using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using SriLankanParadise.ERP.UserManagement.Business_Service;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/itemMaster")]
    public class ItemMasterController : BaseApiController
    {
        private readonly IItemMasterService _itemMasterService;
        private readonly ISubItemMasterService _subItemMasterService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ItemMasterController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ItemMasterController(
            IItemMasterService itemMasterService,
            ISubItemMasterService subItemMasterService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ItemMasterController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _itemMasterService = itemMasterService;
            _subItemMasterService = subItemMasterService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddItemMaster(ItemMasterRequestModel itemMasterRequest)
        {
            try
            {
                var itemMaster = _mapper.Map<ItemMaster>(itemMasterRequest);
                await _itemMasterService.AddItemMaster(itemMaster);

                var subItemMasters = new List<SubItemMaster>();

                if (itemMasterRequest.SubItemMasters != null)
                {
                    foreach (var sim in itemMasterRequest.SubItemMasters)
                    {
                        var subItemMaster = new SubItemMaster()
                        {
                            MainItemMasterId = itemMaster.ItemMasterId,
                            SubItemMasterId = sim.SubItemMasterId,
                            Quantity = sim.Quantity
                        };
                        subItemMasters.Add(subItemMaster);
                    }

                    // Add new sub item masters
                    foreach (var subItemMaster in subItemMasters)
                    {
                        await _subItemMasterService.AddSubItemMaster(subItemMaster);
                    }
                }

                // send response
                var itemMasterDto = _mapper.Map<ItemMasterDto>(itemMaster);
                _logger.LogInformation(LogMessages.ItemMasterCreated);
                AddResponseMessage(Response, LogMessages.ItemMasterCreated, itemMasterDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet]
        public async Task<ApiResponseModel> GetAll()
        {
            try
            {
                var itemMasters = await _itemMasterService.GetAll();
                var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemMastersByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetItemMastersByCompanyId(int companyId)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetItemMastersByCompanyId(companyId);
                if (itemMasters != null)
                {
                    var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMastersNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemMastersByCompanyIdWithQuery/{companyId}")]
        public async Task<ApiResponseModel> GetItemMastersByCompanyIdWithQuery(int companyId, string? searchQuery = null, bool isTreatment = false)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetItemMastersByCompanyWithQueryId(companyId, searchQuery, isTreatment);

                if (itemMasters != null)
                {
                    var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMastersNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpPut("{itemMasterId}")]
        public async Task<ApiResponseModel> UpdateItemMaster(int itemMasterId, ItemMasterRequestModel itemMasterRequest)
        {
            try
            {
                var existingItemMaster = await _itemMasterService.GetItemMasterByItemMasterId(itemMasterId);
                if (existingItemMaster == null)
                {
                    _logger.LogWarning(LogMessages.ItemMasterNotFound);
                    return AddResponseMessage(Response, LogMessages.ItemMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedItemMaster = _mapper.Map<ItemMaster>(itemMasterRequest);
                updatedItemMaster.ItemMasterId = itemMasterId;
                //updatedItemMaster.ItemCode = existingItemMaster.ItemCode;
                // Update item master
                await _itemMasterService.UpdateItemMaster(itemMasterId, updatedItemMaster);

                var subItemMasters = new List<SubItemMaster>();

                if (itemMasterRequest.SubItemMasters != null)
                {
                    // Delete existing sub item masters
                    await _subItemMasterService.DeleteSubItemMastersByMainItemMasterId(itemMasterId);

                    foreach (var sim in itemMasterRequest.SubItemMasters)
                    {
                        var subItemMaster = new SubItemMaster()
                        {
                            MainItemMasterId = itemMasterId,
                            SubItemMasterId = sim.SubItemMasterId,
                            Quantity = sim.Quantity
                        };
                        subItemMasters.Add(subItemMaster);
                    }

                    // Add new sub item masters
                    foreach (var subItemMaster in subItemMasters)
                    {
                        await _subItemMasterService.AddSubItemMaster(subItemMaster);
                    }
                }

                var itemMasterDto = _mapper.Map<ItemMasterDto>(updatedItemMaster);
                _logger.LogInformation(LogMessages.ItemMasterUpdated);
                AddResponseMessage(Response, LogMessages.ItemMasterUpdated, itemMasterDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpDelete("{itemMasterId}")]
        public async Task<ApiResponseModel> DeleteItemMaster(int itemMasterId)
        {
            try
            {
                var existingItemMaster = await _itemMasterService.GetItemMasterByItemMasterId(itemMasterId);
                if (existingItemMaster == null)
                {
                    _logger.LogWarning(LogMessages.ItemMasterNotFound);
                    return AddResponseMessage(Response, LogMessages.ItemMasterNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _itemMasterService.DeleteItemMaster(itemMasterId);

                _logger.LogInformation(LogMessages.ItemMasterDeleted);
                return AddResponseMessage(Response, LogMessages.ItemMasterDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetItemMastersByUserId/{userId}")]
        public async Task<ApiResponseModel> GetItemMastersByUserId(int userId)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetItemMastersByUserId(userId);
                if (itemMasters != null)
                {
                    var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMastersNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemMasterByItemMasterId/{itemMasterId}")]
        public async Task<ApiResponseModel> GetItemMasterByItemMasterId(int itemMasterId)
        {
            try
            {
                var itemMaster = await _itemMasterService.GetItemMasterByItemMasterId(itemMasterId);
                if (itemMaster != null)
                {
                    var itemMasterDto = _mapper.Map<ItemMasterDto>(itemMaster);
                    AddResponseMessage(Response, LogMessages.ItemMasterRetrieved, itemMasterDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMasterNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMasterNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetSubItemsByItemMasterId/{itemMasterId}")]
        public async Task<ApiResponseModel> GetSubItemsByItemMasterId(int itemMasterId)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetSubItemsByItemMasterId(itemMasterId);
                if (itemMasters != null)
                {
                    var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.SubItemsRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SubItemsNotFound);
                    AddResponseMessage(Response, LogMessages.SubItemsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetItemMastersByItemMasterIds")]
        public async Task<ApiResponseModel> GetItemMastersByItemMasterIds([FromQuery] int[] itemMasterIds)
        {
            try
            {
                var itemMasters = await _itemMasterService.GetItemMastersByItemMasterIds(itemMasterIds);
                if (itemMasters != null)
                {
                    var itemMasterDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(itemMasters);
                    AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemMasterDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMastersNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMastersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetSupplierItemsByTypeAndCategory/{companyId}/{itemTypeId}/{categoryId}/{locationId}")]
        public async Task<ApiResponseModel> GetSupplierItemsByTypeAndCategory(int companyId, int itemTypeId, int categoryId, int locationId)
        {
            try
            {
                var supplierItems = await _itemMasterService.GetSupplierItemsByTypeAndCategory(companyId, itemTypeId, categoryId, locationId);
                if (supplierItems != null)
                {
                    AddResponseMessage(Response, LogMessages.SameCategoryTypeSupplierItemsRetrieved, supplierItems, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SameCategoryTypeSupplierItemsNotFound);
                    AddResponseMessage(Response, LogMessages.SameCategoryTypeSupplierItemsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("SearchItemByItemCode")]
        public async Task<ApiResponseModel> SearchItem([FromQuery] string itemCode)
        {
            try
            {
                var items = await _itemMasterService.SearchItemByCode(itemCode);
                if (items != null)
                {
                    var itemDtos = _mapper.Map<IEnumerable<ItemMasterDto>>(items);
                    AddResponseMessage(Response, LogMessages.ItemMastersRetrieved, itemDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ItemMastersNotFound);
                    AddResponseMessage(Response, LogMessages.ItemMastersNotFound, null, true, HttpStatusCode.NotFound);
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
