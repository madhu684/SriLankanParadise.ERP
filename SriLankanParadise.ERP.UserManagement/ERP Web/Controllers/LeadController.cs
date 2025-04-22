using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [Route("api/lead")]
    [ApiController]
    public class LeadController : BaseApiController
    {
        private readonly ILeadService _leadService;
        private readonly IMapper _mapper;
        private readonly ILogger<LeadController> _logger;

        public LeadController(ILeadService leadService, IMapper mapper, ILogger<LeadController> logger)
        {
            _leadService = leadService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ApiResponseModel> GetAllLeads()
        {
            try
            {
                var leads = await _leadService.GetAllLeadsAsync();
                var leadsDtos = _mapper.Map<IEnumerable<LeadDto>>(leads);
                AddResponseMessage(Response, LogMessages.LeadRetrieved, leadsDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{leadId}")]
        public async Task<ApiResponseModel> GetLeadById(int leadId)
        {
            try
            {
                var lead = await _leadService.GetLeadByIdAsync(leadId);
                var leadDto = _mapper.Map<LeadDto>(lead);
                AddResponseMessage(Response, LogMessages.LeadRetrieved, leadDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPost]
        public async Task<ApiResponseModel> CreateLead(LeadRequestModel leadRequest)
        {
            try
            {
                var lead = _mapper.Map<Lead>(leadRequest);
                await _leadService.AddLeadAsync(lead);

                var leadDto = _mapper.Map<LeadDto>(lead);
                AddResponseMessage(Response, LogMessages.LeadRetrieved, leadDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{leadId}")]
        public async Task<ApiResponseModel> UpdateLead(int leadId, LeadRequestModel leadRequest)
        {
            try
            {
                var exsistingLead = await _leadService.GetLeadByIdAsync(leadId);
                if (exsistingLead == null)
                {
                    _logger.LogWarning(LogMessages.LeadNotFound);
                    return AddResponseMessage(Response, LogMessages.LeadNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedLead = _mapper.Map<Lead>(leadRequest);
                updatedLead.LeadId = leadId;

                await _leadService.UpdateLeadAsync(exsistingLead.LeadId, updatedLead);

                _logger.LogInformation(LogMessages.LeadUpdated);
                return AddResponseMessage(Response, LogMessages.LeadUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{leadId}")]
        public async Task<ApiResponseModel> DeleteLead(int leadId)
        {
            try
            {
                var exsistingLead = await _leadService.GetLeadByIdAsync(leadId);
                if (exsistingLead == null)
                {
                    _logger.LogWarning(LogMessages.LeadNotFound);
                    return AddResponseMessage(Response, LogMessages.LeadNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _leadService.DeleteLeadAsync(leadId);

                _logger.LogInformation(LogMessages.LeadDeleted);
                return AddResponseMessage(Response, LogMessages.LeadDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}