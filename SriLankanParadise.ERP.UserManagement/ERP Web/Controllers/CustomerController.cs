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
    [Route("api/customer")]
    public class CustomerController : BaseApiController
    {
        private readonly ICustomerService _customerService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<CustomerController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CustomerController(
            ICustomerService customerService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<CustomerController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _customerService = customerService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddCustomer(CustomerRequestModel customerRequest)
        {
            try
            {
                var customer = _mapper.Map<Customer>(customerRequest);
                await _customerService.AddCustomer(customer);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = customerRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var CustomerDto = _mapper.Map<CustomerDto>(customer);
                _logger.LogInformation(LogMessages.CustomerCreated);
                AddResponseMessage(Response, LogMessages.CustomerCreated, CustomerDto, true, HttpStatusCode.Created);
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
                var customers = await _customerService.GetAll();
                var customerDtos = _mapper.Map<IEnumerable<CustomerDto>>(customers);
                AddResponseMessage(Response, LogMessages.CustomersRetrieved, customerDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetCustomersByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetCustomersByCompanyId(int companyId)
        {
            try
            {
                var customers = await _customerService.GetCustomersByCompanyId(companyId);
                if (customers != null)
                {
                    var customerDtos = _mapper.Map<IEnumerable<CustomerDto>>(customers);
                    AddResponseMessage(Response, LogMessages.CustomersRetrieved, customerDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.CustomersNotFound);
                    AddResponseMessage(Response, LogMessages.CustomersNotFound, null, true, HttpStatusCode.NotFound);
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
