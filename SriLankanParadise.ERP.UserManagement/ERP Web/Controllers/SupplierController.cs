using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

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
    }
}
