using AutoMapper;
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
    [Route("api/company")]
    public class CompanyController : BaseApiController
    {
        private readonly ICompanyService _companyService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<CompanyController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CompanyController(
            ICompanyService companyService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<CompanyController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _companyService = companyService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("{companyId}")]
        public async Task<ApiResponseModel> GetCompanyByCompanyId(int companyId)
        {
            try
            {
                var company = await _companyService.GetCompanyByCompanyId(companyId);
                if (company != null)
                {
                    var companyDto = _mapper.Map<CompanyDto>(company);
                    AddResponseMessage(Response, LogMessages.CompanyRetrieved, companyDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.CompanyNotFound);
                    AddResponseMessage(Response, LogMessages.CompanyNotFound, null, true, HttpStatusCode.NotFound);
                }
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
                var companies = await _companyService.GetAll();
                var companyDtos = _mapper.Map<IEnumerable<CompanyDto>>(companies);
                AddResponseMessage(Response, LogMessages.CompaniesRetrieved, companyDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);               
            }
            return Response;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddCompany(CompanyRequestModel companyRequest)
        {
            try
            {
                var company = _mapper.Map<Company>(companyRequest);
                await _companyService.AddCompany(company);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = companyRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.CompanyCreated);
                AddResponseMessage(Response, LogMessages.CompanyCreated, null, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{companyId}")]
        public async Task<ApiResponseModel> UpdateCompany(int companyId, CompanyRequestModel companyRequest)
        {
            try
            {
                var existingCompany = await _companyService.GetCompanyByCompanyId(companyId);
                if (existingCompany == null)
                {
                    _logger.LogWarning(LogMessages.CompanyNotFound);
                    return AddResponseMessage(Response, LogMessages.CompanyNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedCompany = _mapper.Map<Company>(companyRequest);
                updatedCompany.CompanyId = companyId; // Ensure the ID is not changed

                await _companyService.UpdateCompany(existingCompany.CompanyId, updatedCompany);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = companyRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.CompanyUpdated);
                return AddResponseMessage(Response, LogMessages.CompanyUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        //[HttpDelete("{companyId}")]
        //public async Task<ApiResponseModel> DeleteCompany(int companyId)
        //{
        //    try
        //    {
        //        var existingCompany = await _companyService.GetCompanyByCompanyId(companyId);
        //        if (existingCompany == null)
        //        {
        //            _logger.LogWarning(LogMessages.CompanyNotFound);
        //            return ApiResponse.Error("Company not found", HttpStatusCode.NotFound);
        //        }

        //        await _companyService.DeleteCompany(companyId);
        //        _logger.LogInformation(LogMessages.CompanyDeleted);
        //        return ApiResponse.Success("Company deleted successfully", HttpStatusCode.NoContent);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, ErrorMessages.InternalServerError);
        //        return ApiResponse.Error(ex.Message, HttpStatusCode.InternalServerError);
        //    }
        //}
    }

}
