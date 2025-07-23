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
    [Route("api/supplierItem")]
    public class SupplierItemController : BaseApiController
    {
        private readonly ISupplierItemService _supplierItemService;
        private readonly ILogger<SupplierItemController> _logger;
        private readonly IMapper _mapper;

        public SupplierItemController(ISupplierItemService supplierItemService, ILogger<SupplierItemController> logger, IMapper mapper)
        {
            _supplierItemService = supplierItemService;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ApiResponseModel> CreateSupplierItem(SupplierItemRequestModel supplierItemRequestModel)
        {
            try
            {
                var supplierItem = _mapper.Map<SupplierItem>(supplierItemRequestModel);
                await _supplierItemService.Create(supplierItem);

                var supplierItemDto = _mapper.Map<SupplierItemDto>(supplierItem);
                _logger.LogInformation(LogMessages.SupplierItemCreated);
                AddResponseMessage(Response, LogMessages.SupplierItemCreated, supplierItemDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetById/{supplierId}")]
        public async Task<ApiResponseModel> GetSupplierItemsBySupplierId(int supplierId)
        {
            try
            {
                var supplierItems = await _supplierItemService.GetItemsBySupplierId(supplierId);
                if (supplierItems == null || !supplierItems.Any())
                {
                    _logger.LogError(LogMessages.SupplierItemNotFound);
                    AddResponseMessage(Response, LogMessages.SupplierItemNotFound, null, false, HttpStatusCode.NotFound);
                }
                else
                {
                    var supplierItemModels = _mapper.Map<IEnumerable<SupplierItemDto>>(supplierItems);
                    AddResponseMessage(Response, LogMessages.SupplierItemRetrived, supplierItemModels, true, HttpStatusCode.OK);
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
