using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;
using System.Reflection;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/companySubscriptionModule")]
    public class CompanySubscriptionModuleController : BaseApiController
    {
        private readonly ICompanySubscriptionModuleService _companySubscriptionModuleService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<CompanySubscriptionModuleController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CompanySubscriptionModuleController(
            ICompanySubscriptionModuleService companySubscriptionModuleService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<CompanySubscriptionModuleController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _companySubscriptionModuleService = companySubscriptionModuleService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("{companySubscriptionModuleModuleId}")]
        public async Task<ApiResponseModel> GetCompanySubscriptionModuleByCompanySubscriptionModuleId(int companySubscriptionModuleid)
        {
            try
            {
                var companySubscriptionModule = await _companySubscriptionModuleService.GetCompanySubscriptionModuleByCompanySubscriptionModuleId(companySubscriptionModuleid);
                if (companySubscriptionModule != null)
                {
                    var CompanySubscriptionModuleDto = _mapper.Map<CompanySubscriptionModuleDto>(companySubscriptionModule);
                    AddResponseMessage(Response, LogMessages.CompanySubscriptionModuleRetrieved, CompanySubscriptionModuleDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.CompanySubscriptionModuleNotFound);
                    AddResponseMessage(Response, LogMessages.CompanySubscriptionModuleNotFound, null, true, HttpStatusCode.NotFound);
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
                var companySubscriptionModules = await _companySubscriptionModuleService.GetAll();
                var companySubscriptionModuleDtos = _mapper.Map<IEnumerable<CompanySubscriptionModuleDto>>(companySubscriptionModules);
                AddResponseMessage(Response, LogMessages.CompanySubscriptionModulesRetrieved, companySubscriptionModuleDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddCompanySubscriptionModule(CompanySubscriptionModuleRequestModel companySubscriptionModuleRequest)
        {
            try
            {
                var companySubscriptionModule = _mapper.Map<CompanySubscriptionModule>(companySubscriptionModuleRequest);
                await _companySubscriptionModuleService.AddCompanySubscriptionModule(companySubscriptionModule);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = companySubscriptionModuleRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.CompanySubscriptionModuleCreated);
                AddResponseMessage(Response, LogMessages.CompanySubscriptionModuleCreated, null, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{companySubscriptionModuleId}")]
        public async Task<ApiResponseModel> UpdateCompanySubscriptionModule(int companySubscriptionModuleId, CompanySubscriptionModuleRequestModel companySubscriptionModuleRequest)
        {
            try
            {
                var existingCompanySubscriptionModule = await _companySubscriptionModuleService.GetCompanySubscriptionModuleByCompanySubscriptionModuleId(companySubscriptionModuleId);
                if (existingCompanySubscriptionModule == null)
                {
                    _logger.LogWarning(LogMessages.CompanySubscriptionModuleNotFound);
                    return AddResponseMessage(Response, LogMessages.CompanySubscriptionModuleNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedCompanySubscriptionModule = _mapper.Map<CompanySubscriptionModule>(companySubscriptionModuleRequest);
                updatedCompanySubscriptionModule.CompanySubscriptionModuleId = companySubscriptionModuleId; // Ensure the ID is not changed

                await _companySubscriptionModuleService.UpdateCompanySubscriptionModule(existingCompanySubscriptionModule.CompanySubscriptionModuleId, updatedCompanySubscriptionModule);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = companySubscriptionModuleRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.CompanySubscriptionModuleUpdated);
                return AddResponseMessage(Response, LogMessages.CompanySubscriptionModuleUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        //[HttpDelete("{CompanySubscriptionModuleId}")]
        //public async Task<ApiResponseModel> DeleteCompanySubscriptionModule(int CompanySubscriptionModuleId)
        //{
        //    try
        //    {
        //        var existingCompanySubscriptionModule = await _companySubscriptionModuleService.GetCompanySubscriptionModuleByCompanySubscriptionModuleId(CompanySubscriptionModuleId);
        //        if (existingCompanySubscriptionModule == null)
        //        {
        //            _logger.LogWarning(LogMessages.CompanySubscriptionModuleNotFound);
        //            return ApiResponse.Error("CompanySubscriptionModule not found", HttpStatusCode.NotFound);
        //        }

        //        await _companySubscriptionModuleService.DeleteCompanySubscriptionModule(CompanySubscriptionModuleId);
        //        _logger.LogInformation(LogMessages.CompanySubscriptionModuleDeleted);
        //        return ApiResponse.Success("CompanySubscriptionModule deleted successfully", HttpStatusCode.NoContent);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, ErrorMessages.InternalServerError);
        //        return ApiResponse.Error(ex.Message, HttpStatusCode.InternalServerError);
        //    }
        //}




        //[HttpGet("{crmAgentId}")]
        //public AgentInfo GetAgentInfo(string crmAgencyId)
        //{
        //    if (string.IsNullOrWhiteSpace(crmAgencyId))
        //        return null;

        //    var agentInfo = new AgentInfo();

        //    string requestURI = "https://prod.author.hlo-prod.magnolia-platform.io/.rest/api/agent/get-agent-by-crmagencyid/HLA00225";
        //    string username = "hlo-agent-api-user";
        //    string password = "@gent_5@pi_user";

        //    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, requestURI);
        //    request.Headers.Add("Authorization", GetBasicAuthenticationHeader(username, password));

        //    using (HttpClient client = new HttpClient())
        //    {
        //        HttpResponseMessage response = client.SendAsync(request).Result;

        //        if (response.IsSuccessStatusCode)
        //        {
        //            string responseContent = response.Content.ReadAsStringAsync().Result;

        //            var result = JsonConvert.DeserializeObject<AgentInfoResponseModel>(responseContent);

        //            if ((result != null) && (result.Status == HttpStatusCode.OK))
        //                return result == null ? null : result.Data.Result.ToObject<AgentInfo>();
        //        }
        //        return null;
        //    }
        //}

        //private static string GetBasicAuthenticationHeader(string username, string password)
        //{
        //    string valueToEncode = username + ":" + password;
        //    byte[] bytes = System.Text.Encoding.UTF8.GetBytes(valueToEncode);
        //    string base64String = Convert.ToBase64String(bytes);
        //    return "Basic " + base64String;
        //}

        [HttpGet("modules/company/{companyId}")]
        public async Task<ApiResponseModel> GetCompanySubscriptionModulesByCompanyId(int companyId)
        {
            try
            {
                var companySubModules = await _companySubscriptionModuleService.GetCompanySubscriptionModulesByCompanyId(companyId);
                if (companySubModules != null)
                {
                    var ModuleWithIdDto = _mapper.Map<IEnumerable<CompanySubscriptionModuleDto>>(companySubModules);
                    AddResponseMessage(Response, LogMessages.CompanySubscriptionModulesRetrieved, ModuleWithIdDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.CompanySubscriptionModulesNotFound);
                    AddResponseMessage(Response, LogMessages.CompanySubscriptionModulesNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("companySubscriptionModuleId/{companyId}/{moduleId}")]
        public async Task<ApiResponseModel> GetCompanySubscriptionModuleIdByCompanyIdAndModuleId(int companyId, int moduleId)
        {
            try
            {
                var companySubscriptionModuleId = await _companySubscriptionModuleService.GetCompanySubscriptionModuleIdByCompanyIdAndModuleId(companyId, moduleId);
                if (companySubscriptionModuleId != null)
                {
                    
                    AddResponseMessage(Response, LogMessages.CompanySubscriptionModuleIdRetrieved, companySubscriptionModuleId, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.CompanySubscriptionModuleIdNotFound);
                    AddResponseMessage(Response, LogMessages.CompanySubscriptionModuleIdNotFound, null, true, HttpStatusCode.NotFound);
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
