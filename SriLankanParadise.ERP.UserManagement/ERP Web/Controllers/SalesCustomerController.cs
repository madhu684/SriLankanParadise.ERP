using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [Route("api/salesCustomer")]
    [ApiController]
    public class SalesCustomerController : BaseApiController
    {
        private readonly ISalesCustomerService _salesCustomerService;
        private readonly IMapper _mapper;
        private readonly ILogger<SalesCustomerController> _logger;

        public SalesCustomerController(ISalesCustomerService salesCustomerService, IMapper mapper, ILogger<SalesCustomerController> logger)
        {
            _salesCustomerService = salesCustomerService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ApiResponseModel> CreateSalesCustomer(SalesCustomerRequestModel requestModel)
        {
            try
            {
                var salesCustomer = _mapper.Map<SalesCustomer>(requestModel);

                await _salesCustomerService.CreateSalesCustomer(salesCustomer);
                var salesCustomerDto = _mapper.Map<SalesCustomerDto>(salesCustomer);

                _logger.LogInformation(LogMessages.SalesCustomerCreated);
                AddResponseMessage(Response, LogMessages.SalesCustomerCreated, salesCustomerDto, true, HttpStatusCode.Created);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{salesCustomerId}")]
        public async Task<ApiResponseModel> GetById(int salesCustomerId)
        {
            try
            {
                var salesCustomer = await _salesCustomerService.GetById(salesCustomerId);
                if (salesCustomer == null)
                {
                    _logger.LogWarning(LogMessages.SalesCustomerNotFound);
                    AddResponseMessage(Response, LogMessages.SalesCustomerNotFound, null, false, HttpStatusCode.NotFound);
                    return Response;
                }
                var salesCustomerDto = _mapper.Map<SalesCustomerDto>(salesCustomer);
                _logger.LogInformation(LogMessages.SalesCustomerRetrieved);
                AddResponseMessage(Response, LogMessages.SalesCustomerRetrieved, salesCustomerDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetSalesCustomersByCompanyId(int companyId)
        {
            try
            {
                var salesCustomers = await _salesCustomerService.GetSalesCustomersByCompanyId(companyId);
                if(salesCustomers != null)
                {
                    var salesCustomerDtos = _mapper.Map<IEnumerable<SalesCustomerDto>>(salesCustomers);
                    _logger.LogInformation(LogMessages.SalesCustomersRetrieved);
                    AddResponseMessage(Response, LogMessages.SalesCustomersRetrieved, salesCustomerDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SalesCustomerNotFound);
                    AddResponseMessage(Response, LogMessages.SalesCustomerNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch( Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }
    }
}
