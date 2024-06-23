using System.IO.Compression;
using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/supplierAttachment")]
    public class SupplierAttachmentController : BaseApiController
    {
        private readonly ISupplierAttachmentService _supplierAttachmentService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SupplierAttachmentController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SupplierAttachmentController(
            ISupplierAttachmentService supplierAttachmentService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SupplierAttachmentController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _supplierAttachmentService = supplierAttachmentService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }


        [HttpPost]
        public async Task<ApiResponseModel> AddSupplierAttachment(SupplierAttachmentRequestModel supplierAttachmentRequest)
        {
            try
            {
                var supplierAttachment = _mapper.Map<SupplierAttachment>(supplierAttachmentRequest);
                await _supplierAttachmentService.AddSupplierAttachment(supplierAttachment);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = supplierAttachmentRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var supplierAttachmentDto = _mapper.Map<SupplierAttachmentDto>(supplierAttachment);
                _logger.LogInformation(LogMessages.SupplierAttachmentCreated);
                AddResponseMessage(Response, LogMessages.SupplierAttachmentCreated, supplierAttachmentDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }



        [HttpDelete("{supplierAttachmentId}")]
        public async Task<ApiResponseModel> DeleteSupplierAttachment(int supplierAttachmentId)
        {
            try
            {
                var existingSupplierAttachment = await _supplierAttachmentService.GetSupplierAttachmentBySupplierAttachmentId(supplierAttachmentId);
                if (existingSupplierAttachment == null)
                {
                    _logger.LogWarning(LogMessages.SupplierAttachmentNotFound);
                    return AddResponseMessage(Response, LogMessages.SupplierAttachmentNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _supplierAttachmentService.DeleteSupplierAttachment(supplierAttachmentId);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = 1076,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SupplierAttachmentDeleted);
                return AddResponseMessage(Response, LogMessages.SupplierAttachmentDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }


        [HttpGet("attachment/{supplierAttachmentId}")]
        public async Task<IActionResult> GetSupplierLogo(int supplierAttachmentId)
        {
            try
            {
                (byte[] fileBytes, string contentType) = await _supplierAttachmentService.GetSupplierAttachmentFileAndContentTypeAsync(supplierAttachmentId);

                if (fileBytes != null && contentType != null)
                {
                    return File(fileBytes, contentType); // Directly return the attachment file here
                }
                else
                {
                    _logger.LogWarning(LogMessages.SupplierAttachmentNotFound);
                    return NotFound(LogMessages.SupplierAttachmentNotFound); // Return a NotFound result
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return StatusCode(500, ex.Message); // Return an InternalServerError result
            }
        }

        [HttpPut("{supplierAttachmentId}")]
        public async Task<ApiResponseModel> UpdateSupplierAttachment(int supplierAttachmentId, SupplierAttachmentRequestModel supplierAttachmentRequest)
        {
            try
            {
                var existingSupplierAttachment = await _supplierAttachmentService.GetSupplierAttachmentBySupplierAttachmentId(supplierAttachmentId);
                if (existingSupplierAttachment == null)
                {
                    _logger.LogWarning(LogMessages.SupplierAttachmentNotFound);
                    return AddResponseMessage(Response, LogMessages.SupplierAttachmentNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedSupplierAttachment = _mapper.Map<SupplierAttachment>(supplierAttachmentRequest);
                updatedSupplierAttachment.SupplierAttachmentId = supplierAttachmentId; // Ensure the ID is not changed


                await _supplierAttachmentService.UpdateSupplierAttachment(existingSupplierAttachment.SupplierAttachmentId, updatedSupplierAttachment);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = supplierAttachmentRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SupplierAttachmentUpdated);
                return AddResponseMessage(Response, LogMessages.SupplierAttachmentUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

    }
}
