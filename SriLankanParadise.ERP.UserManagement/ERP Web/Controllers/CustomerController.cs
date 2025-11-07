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

        [HttpGet("{id}")]
        public async Task<ApiResponseModel> GetById(int id)
        {
            try
            {
                var customer = await _customerService.GetCustomerById(id);

                if (customer != null)
                {
                    var customerDto = _mapper.Map<CustomerDto>(customer);
                    AddResponseMessage(Response, LogMessages.CustomersRetrieved, customerDto, true, HttpStatusCode.OK);
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

        [HttpPut("{id}")]
        public async Task<ApiResponseModel> UpdateCustomer(int id, CustomerRequestModel customerRequest)
        {
            try
            {
                var existingCustomer = await _customerService.GetCustomerById(id);
                if (existingCustomer == null)
                {
                    _logger.LogWarning(LogMessages.CustomersNotFound);
                    AddResponseMessage(Response, LogMessages.CustomersNotFound, null, true, HttpStatusCode.NotFound);
                    return Response;
                }
                var customerToUpdate = _mapper.Map<Customer>(customerRequest);

                customerToUpdate.CustomerId = id;

                await _customerService.UpdateCustomer(existingCustomer.CustomerId, customerToUpdate);
                _logger.LogInformation(LogMessages.CustomerUpdated);
                AddResponseMessage(Response, LogMessages.CustomerUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPatch("ActiveDeactiveUser/{id}")]
        public async Task<ApiResponseModel> ActiveDeactiveUser(int id, CustomerUpdateRequestModel customerRequest)
        {
            try
            {
                var existingCustomer = await _customerService.GetCustomerById(id);
                if (existingCustomer == null)
                {
                    _logger.LogWarning(LogMessages.CustomersNotFound);
                    AddResponseMessage(Response, LogMessages.CustomersNotFound, null, true, HttpStatusCode.NotFound);
                    return Response;
                }
                var customerToUpdate = _mapper.Map<Customer>(customerRequest);
                customerToUpdate.CustomerId = id;
                await _customerService.ActiveDeactiveUser(existingCustomer.CustomerId, customerToUpdate);
                _logger.LogInformation(LogMessages.CustomerUpdated);
                AddResponseMessage(Response, LogMessages.CustomerUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("SearchCustomersByName")]
        public async Task<ApiResponseModel> SearchCustomersByName([FromQuery] string searchQuery)
        {
            try
            {
                var customers = await _customerService.SearchCustomersByName(searchQuery);
                if (customers != null && customers.Any())
                {
                    var customerDtos = _mapper.Map<IEnumerable<CustomerDto>>(customers);
                    _logger.LogInformation(LogMessages.CustomersRetrieved);
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

        [HttpPatch("UpdateOutstandingBalance/{id}/{movementTypeId}")]
        public async Task<ApiResponseModel> UpdateOutstandingBalance(int id, int movementTypeId, CustomerOutstandingBalanceUpdateRequestModel requestModel)
        {
            try
            {
                var existingCustomer = await _customerService.GetCustomerById(id);
                if (existingCustomer == null)
                {
                    _logger.LogWarning(LogMessages.CustomersNotFound);
                    AddResponseMessage(Response, LogMessages.CustomersNotFound, null, true, HttpStatusCode.NotFound);
                    return Response;
                }
                var customerToUpdate = _mapper.Map<Customer>(requestModel);
                customerToUpdate.CustomerId = id;

                await _customerService.UpdateOutstandingBalance(existingCustomer.CustomerId, movementTypeId, customerToUpdate);
                _logger.LogInformation(LogMessages.CustomerOutstandingBalanceUpdated);
                AddResponseMessage(Response, LogMessages.CustomerOutstandingBalanceUpdated, null, true, HttpStatusCode.OK);
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
