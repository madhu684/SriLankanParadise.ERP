using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/customerDeliveryAddress")]
    public class CustomerDeliveryAddressController : BaseApiController
    {
        private readonly ICustomerDeliveryAddressService _customerDeliveryAddressService;
        private readonly IMapper _mapper;
        private readonly ILogger<CustomerDeliveryAddressController> _logger;

        public CustomerDeliveryAddressController(ICustomerDeliveryAddressService customerDeliveryAddressService, IMapper mapper, ILogger<CustomerDeliveryAddressController> logger)
        {
            _customerDeliveryAddressService = customerDeliveryAddressService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddCustomerDeliveryAddress(CustomerDeliveryAddressRequestModel customerDeliveryAddressRequestModel)
        {
            try
            {
                var customerDeliveryAddress = _mapper.Map<CustomerDeliveryAddress>(customerDeliveryAddressRequestModel);
                await _customerDeliveryAddressService.AddCustomerDeliveryAddress(customerDeliveryAddress);
                var customerDeliveryAddressDto = _mapper.Map<CustomerDeliveryAddressDto>(customerDeliveryAddress);
                _logger.LogInformation(LogMessages.CustomerDeliveryAddressCreated);
                AddResponseMessage(Response, LogMessages.CustomerDeliveryAddressCreated, customerDeliveryAddressDto, true, HttpStatusCode.Created);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetCustomerDeliveryAddressById/{id}")]
        public async Task<ApiResponseModel> GetCustomerDeliveryAddressById(int id)
        {
            try
            {
                var customerDeliveryAddress = await _customerDeliveryAddressService.GetCustomerDeliveryAddressById(id);
                if (customerDeliveryAddress == null)
                {
                    _logger.LogWarning(LogMessages.CustomerDeliveryAddressNotFound);
                    AddResponseMessage(Response, LogMessages.CustomerDeliveryAddressNotFound, null, false, HttpStatusCode.NotFound);
                }
                else
                {
                    var customerDeliveryAddressDto = _mapper.Map<CustomerDeliveryAddressDto>(customerDeliveryAddress);
                    _logger.LogInformation(LogMessages.CustomerDeliveryAddressRetrieved);
                    AddResponseMessage(Response, LogMessages.CustomerDeliveryAddressRetrieved, customerDeliveryAddressDto, true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetCustomerDeliveryAddressesByCustomerId/{customerId}")]
        public async Task<ApiResponseModel> GetCustomerDeliveryAddressesByCustomerId(int customerId)
        {
            try
            {
                var customerDeliveryAddresses = await _customerDeliveryAddressService.GetCustomerDeliveryAddressesByCustomerId(customerId);
                if (!customerDeliveryAddresses.Any())
                {
                    _logger.LogWarning(LogMessages.CustomerDeliveryAddressesNotFound);
                    AddResponseMessage(Response, LogMessages.CustomerDeliveryAddressesNotFound, null, false, HttpStatusCode.NotFound);
                    return Response;
                }
                var customerDeliveryAddressDto = _mapper.Map<IEnumerable<CustomerDeliveryAddressDto>>(customerDeliveryAddresses);
                _logger.LogInformation(LogMessages.CustomerDeliveryAddressesRetrieved);
                AddResponseMessage(Response, LogMessages.CustomerDeliveryAddressesRetrieved, customerDeliveryAddressDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{id}")]
        public async Task<ApiResponseModel> UpdateCustomerDeliveryAddress(int id, CustomerDeliveryAddressRequestModel customerDeliveryAddressRequestModel)
        {
            try
            {
                var existingAddress = await _customerDeliveryAddressService.GetCustomerDeliveryAddressById(id);
                if (existingAddress == null)
                {
                    _logger.LogWarning(LogMessages.CustomerDeliveryAddressNotFound);
                    AddResponseMessage(Response, LogMessages.CustomerDeliveryAddressNotFound, null, false, HttpStatusCode.NotFound);
                }
                else
                {
                    var customerDeliveryAddress = _mapper.Map<CustomerDeliveryAddress>(customerDeliveryAddressRequestModel);

                    customerDeliveryAddress.Id = id; // Ensure the ID is set for the update
                    await _customerDeliveryAddressService.UpdateCustomerDeliveryAddress(existingAddress.Id, customerDeliveryAddress);

                    _logger.LogInformation(LogMessages.CustomerDeliveryAddressUpdated);
                    AddResponseMessage(Response, LogMessages.CustomerDeliveryAddressUpdated, null, true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpDelete("{id}")]
        public async Task<ApiResponseModel> DeleteCustomerDeliveryAddress(int id)
        {
            try
            {
                var existingAddress = await _customerDeliveryAddressService.GetCustomerDeliveryAddressById(id);
                if (existingAddress == null)
                {
                    _logger.LogWarning(LogMessages.CustomerDeliveryAddressNotFound);
                    AddResponseMessage(Response, LogMessages.CustomerDeliveryAddressNotFound, null, false, HttpStatusCode.NotFound);
                }
                else
                {
                    await _customerDeliveryAddressService.DeleteCustomerDeliveryAddress(id);
                    _logger.LogInformation(LogMessages.CustomerDeliveryAddressDeleted);
                    AddResponseMessage(Response, LogMessages.CustomerDeliveryAddressDeleted, null, true, HttpStatusCode.OK);
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
