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
    [Route("api/batch")]
    public class BatchController : BaseApiController
    {
        private readonly IBatchService _batchService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<BatchController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BatchController(
            IBatchService batchService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<BatchController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _batchService = batchService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddBatch(BatchRequestModel batchRequest)
        {
            try
            {
                var batch= _mapper.Map<Batch>(batchRequest);
                await _batchService.AddBatch(batch);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = batchRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var batchDto = _mapper.Map<BatchDto>(batch);
                _logger.LogInformation(LogMessages.BatchCreated);
                AddResponseMessage(Response, LogMessages.BatchCreated, batchDto, true, HttpStatusCode.Created);
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
                var batches = await _batchService.GetAll();
                var batchDtos = _mapper.Map<IEnumerable<BatchDto>>(batches);
                AddResponseMessage(Response, LogMessages.BatchesRetrieved, batchDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetBatchesByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetBatchesByCompanyId(int companyId)
        {
            try
            {
                var batches = await _batchService.GetBatchesByCompanyId(companyId);
                if (batches != null)
                {
                    var batchDtos = _mapper.Map<IEnumerable<BatchDto>>(batches);
                    AddResponseMessage(Response, LogMessages.BatchesRetrieved, batchDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.BatchesNotFound);
                    AddResponseMessage(Response, LogMessages.BatchesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetBatchesByBatchRef/{batchRef}")]
        public async Task<ApiResponseModel> GetBatchesByBatchRef(string batchRef)
        {
            try
            {
                var batches = await _batchService.GetBatchesByBatchRef(batchRef);
                if (batches != null)
                {
                    var batchDtos = _mapper.Map<BatchDto>(batches);
                    AddResponseMessage(Response, LogMessages.BatchesRetrieved, batchDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.BatchesNotFound);
                    AddResponseMessage(Response, LogMessages.BatchesNotFound, null, true, HttpStatusCode.NotFound);
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
