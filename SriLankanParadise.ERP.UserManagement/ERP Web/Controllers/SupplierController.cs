using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/supplier")]
    public class SupplierController : BaseApiController
    {
        private readonly ISupplierService _supplierService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SupplierController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SupplierController(
            ISupplierService supplierService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SupplierController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _supplierService = supplierService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("GetSuppliersByCompanyId")]
        public async Task<ApiResponseModel> GetSuppliersByCompanyId(int companyId)
        {
            try
            {
                var suppliers = await _supplierService.GetSuppliersByCompanyId(companyId);
                if (suppliers != null)
                {
                    var supplierDtos = _mapper.Map<IEnumerable<SupplierDto>>(suppliers);
                    AddResponseMessage(Response, LogMessages.SuppliersRetrieved, supplierDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SuppliersNotFound);
                    AddResponseMessage(Response, LogMessages.SuppliersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSupplier(SupplierRequestModel supplierRequest)
        {
            try
            {
                var supplier = _mapper.Map<Supplier>(supplierRequest);
                await _supplierService.AddSupplier(supplier);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = supplierRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var supplierDto= _mapper.Map<SupplierDto>(supplier);
                _logger.LogInformation(LogMessages.SupplierCreated);
                AddResponseMessage(Response, LogMessages.SupplierCreated, supplierDto, true, HttpStatusCode.Created);
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
