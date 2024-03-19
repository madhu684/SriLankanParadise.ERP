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
    [Route("api/transactionType")]
    public class TransactionTypeController : BaseApiController
    {
        private readonly ITransactionTypeService _transactionTypeService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<TransactionTypeController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TransactionTypeController(
            ITransactionTypeService transactionTypeService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<TransactionTypeController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _transactionTypeService = transactionTypeService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }


        [HttpGet("GetTransactionTypes")]
        public async Task<ApiResponseModel> GetTransactionTypes()
        {
            try
            {
                var transactionTypes = await _transactionTypeService.GetTransactionTypes();
                if (transactionTypes != null)
                {
                    var transactionTypeDtos = _mapper.Map<IEnumerable<TransactionTypeDto>>(transactionTypes);
                    AddResponseMessage(Response, LogMessages.TransactionTypesRetrieved, transactionTypeDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.TransactionTypesNotFound);
                    AddResponseMessage(Response, LogMessages.TransactionTypesNotFound, null, true, HttpStatusCode.NotFound);
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
