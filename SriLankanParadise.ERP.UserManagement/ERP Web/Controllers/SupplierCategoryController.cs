using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/supplierCategory")]
    public class SupplierCategoryController : BaseApiController
    {
        private readonly ISupplierCategoryService _supplierCategoryService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SupplierCategoryController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SupplierCategoryController(
            ISupplierCategoryService supplierCategoryService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SupplierCategoryController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _supplierCategoryService = supplierCategoryService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }


        [HttpPost]
        public async Task<ApiResponseModel> AddSupplierCategory(SupplierCategoryRequestModel supplierCategoryRequest)
        {
            try
            {
                var supplierCategory = _mapper.Map<SupplierCategory>(supplierCategoryRequest);
                await _supplierCategoryService.AddSupplierCategory(supplierCategory);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = supplierCategoryRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var supplierCategoryDto = _mapper.Map<SupplierCategoryDto>(supplierCategory);
                _logger.LogInformation(LogMessages.SupplierCategoryCreated);
                AddResponseMessage(Response, LogMessages.SupplierCategoryCreated, supplierCategoryDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        

        [HttpDelete("{supplierCategoryId}")]
        public async Task<ApiResponseModel> DeleteSupplierCategory(int supplierCategoryId)
        {
            try
            {
                var existingSupplierCategory = await _supplierCategoryService.GetSupplierCategoryBySupplierCategoryId(supplierCategoryId);
                if (existingSupplierCategory == null)
                {
                    _logger.LogWarning(LogMessages.SupplierCategoryNotFound);
                    return AddResponseMessage(Response, LogMessages.SupplierCategoryNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _supplierCategoryService.DeleteSupplierCategory(supplierCategoryId);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = 1074,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SupplierCategoryDeleted);
                return AddResponseMessage(Response, LogMessages.SupplierCategoryDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
