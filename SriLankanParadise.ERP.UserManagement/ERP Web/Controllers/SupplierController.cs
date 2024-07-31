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
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = supplierRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

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

        [HttpPut("{supplierId}")]
        public async Task<ApiResponseModel> UpdateSupplier(int supplierId, SupplierRequestModel supplierRequest)
        {
            try
            {
                var existingSupplier = await _supplierService.GetSupplierBySupplierId(supplierId);
                if (existingSupplier == null)
                {
                    _logger.LogWarning(LogMessages.SupplierNotFound);
                    return AddResponseMessage(Response, LogMessages.SupplierNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedSupplier = _mapper.Map<Supplier>(supplierRequest);
                updatedSupplier.SupplierId = supplierId; // Ensure the ID is not changed
                

                await _supplierService.UpdateSupplier(existingSupplier.SupplierId, updatedSupplier);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = supplierRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SupplierUpdated);
                return AddResponseMessage(Response, LogMessages.SupplierUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{supplierId}")]
        public async Task<ApiResponseModel> DeleteSupplier(int supplierId)
        {
            try
            {
                var existingSupplier = await _supplierService.GetSupplierBySupplierId(supplierId);
                if (existingSupplier == null)
                {
                    _logger.LogWarning(LogMessages.SupplierNotFound);
                    return AddResponseMessage(Response, LogMessages.SupplierNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _supplierService.DeleteSupplier(supplierId);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = 1070,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SupplierDeleted);
                return AddResponseMessage(Response, LogMessages.SupplierDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("upload/logo")]
        public async Task<ApiResponseModel> UploadSupplierLogo([FromForm] SupplierLogoRequestModel supplierLogoRequest)
        {
            try
            {
                var supplierLogo = supplierLogoRequest.LogoFile;
                var filePath = await _supplierService.UploadSupplierLogo(supplierLogo);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = supplierLogoRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SupplierLogoUploaded);
                return AddResponseMessage(Response, LogMessages.SupplierLogoUploaded, filePath, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("upload/attachment")]
        public async Task<ApiResponseModel> UploadSupplierAttachment([FromForm] SupplierAttachmentUploadRequestModel supplierAttachmentRequest)
        {
            try
            {
                var supplierAttachment = supplierAttachmentRequest.AttachmentFile;
                var filePath = await _supplierService.UploadSupplierAttachment(supplierAttachment);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = supplierAttachmentRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SupplierAttachmentUploaded);
                return AddResponseMessage(Response, LogMessages.SupplierAttachmentUploaded, filePath, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }


        [HttpGet("logo/{supplierId}")]
        public async Task<IActionResult> GetSupplierLogo(int supplierId)
        {
            try
            {
                (byte[] logoBytes, string contentType) = await _supplierService.GetSupplierLogoFileAndContentTypeAsync(supplierId);

                if (logoBytes != null && contentType != null)
                {
                    return File(logoBytes, contentType); // Directly return the image file here
                }
                else
                {
                    _logger.LogWarning(LogMessages.SupplierLogoNotFound);
                    return NotFound(LogMessages.SupplierLogoNotFound); // Return a NotFound result
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return StatusCode(500, ex.Message); // Return an InternalServerError result
            }
        }
    }
}
