using System.ComponentModel.Design;
using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    [Route("api/expenseOutRequisition")]
    public class ExpenseOutRequisitionController : BaseApiController
    {
        private readonly IExpenseOutRequisitionService _expenseOutRequisitionService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<ExpenseOutRequisitionController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ExpenseOutRequisitionController(
            IExpenseOutRequisitionService expenseOutRequisitionService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<ExpenseOutRequisitionController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _expenseOutRequisitionService = expenseOutRequisitionService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddExpenseOutRequisition(ExpenseOutRequisitionRequestModel expenseOutRequisitionRequestModel)
        {
            try
            {
                var expenseOutRequisition = _mapper.Map<ExpenseOutRequisition>(expenseOutRequisitionRequestModel);
                await _expenseOutRequisitionService.AddExpenseOutRequisition(expenseOutRequisition);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = expenseOutRequisitionRequestModel.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var expenseOutRequisitionDto = _mapper.Map<ExpenseOutRequisitionDto>(expenseOutRequisition);
                _logger.LogInformation(LogMessages.ExpenseOutRequisitionCreated);
                AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionCreated, expenseOutRequisitionDto, true, HttpStatusCode.Created);
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
                var expenseOutRequisitions = await _expenseOutRequisitionService.GetAll();
                var expenseOutRequisitionDtos = _mapper.Map<IEnumerable<ExpenseOutRequisitionDto>>(expenseOutRequisitions);
                AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionsRetrieved, expenseOutRequisitionDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetExpenseOutRequisitionsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetExpenseOutRequisitionsByCompanyId(int companyId)
        {
            try
            {
                var expenseOutRequisitions = await _expenseOutRequisitionService.GetExpenseOutRequisitionsByCompanyId(companyId);
                if (expenseOutRequisitions != null)
                {
                    var expenseOutRequisitionDtos = _mapper.Map<IEnumerable<ExpenseOutRequisitionDto>>(expenseOutRequisitions);
                    AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionsRetrieved, expenseOutRequisitionDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ExpenseOutRequisitionsNotFound);
                    AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionsNotFound, null, true, HttpStatusCode.NotFound);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }


        [HttpGet("GetExpenseOutRequisitionsByUserId/{userId}")]
        public async Task<ApiResponseModel> GetExpenseOutRequisitionsByUserId(int userId)
        {
            try
            {
                var expenseOutRequisitions = await _expenseOutRequisitionService.GetExpenseOutRequisitionsByUserId(userId);
                if (expenseOutRequisitions != null)
                {
                    var expenseOutRequisitionDtos = _mapper.Map<IEnumerable<ExpenseOutRequisitionDto>>(expenseOutRequisitions);
                    AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionsRetrieved, expenseOutRequisitionDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ExpenseOutRequisitionsNotFound);
                    AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{expenseOutRequisitionId}")]
        public async Task<ApiResponseModel> GetExpenseOutRequisitionByExpenseOutRequisitionId(int expenseOutRequisitionId)
        {
            try
            {
                var expenseOutRequisition = await _expenseOutRequisitionService.GetExpenseOutRequisitionByExpenseOutRequisitionId(expenseOutRequisitionId);
                if (expenseOutRequisition != null)
                {
                    var expenseOutRequisitionDto = _mapper.Map<ExpenseOutRequisitionDto>(expenseOutRequisition);
                    AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionRetrieved, expenseOutRequisitionDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ExpenseOutRequisitionNotFound);
                    AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{expenseOutRequisitionId}")]
        public async Task<ApiResponseModel> UpdateExpenseOutRequisition(int expenseOutRequisitionId, ExpenseOutRequisitionRequestModel expenseOutRequisitionRequest)
        {
            try
            {
                var existingExpenseOutRequisition = await _expenseOutRequisitionService.GetExpenseOutRequisitionByExpenseOutRequisitionId(expenseOutRequisitionId);
                if (existingExpenseOutRequisition == null)
                {
                    _logger.LogWarning(LogMessages.ExpenseOutRequisitionNotFound);
                    return AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedExpenseOutRequisition = _mapper.Map<ExpenseOutRequisition>(expenseOutRequisitionRequest);
                updatedExpenseOutRequisition.ExpenseOutRequisitionId = expenseOutRequisitionId; // Ensure the ID is not changed

                await _expenseOutRequisitionService.UpdateExpenseOutRequisition(existingExpenseOutRequisition.ExpenseOutRequisitionId, updatedExpenseOutRequisition);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = expenseOutRequisitionRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.ExpenseOutRequisitionUpdated);
                return AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("GetApprovedExpenseOutRequisitio/{companyId}/{status}")]
        public async Task<ApiResponseModel> GetApprovedExpenseOutRequisition(int companyId, int status, [FromQuery] string? searchQuery) 
        {
            try
            {
                var expenseOutRequisitions = await _expenseOutRequisitionService.GetApprovedExpenseOutRequisitions(status, companyId, searchQuery);
                if (expenseOutRequisitions != null)
                {
                    var expenseOutRequisitionDtos = _mapper.Map<IEnumerable<ExpenseOutRequisitionDto>>(expenseOutRequisitions);
                    AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionsRetrieved, expenseOutRequisitionDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.ExpenseOutRequisitionsNotFound);
                    AddResponseMessage(Response, LogMessages.ExpenseOutRequisitionsNotFound, null, true, HttpStatusCode.NotFound);
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
