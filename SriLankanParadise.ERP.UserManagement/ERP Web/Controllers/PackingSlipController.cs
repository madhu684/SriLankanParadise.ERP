using AutoMapper;
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
    [ApiController]
    [Route("api/packingSlip")]
    public class PackingSlipController : BaseApiController
    {
        private readonly IPackingSlipService _packingSlipService;
        private readonly IMapper _mapper;
        private readonly ILogger<PackingSlipController> _logger;

        public PackingSlipController(IPackingSlipService packingSlipService, IMapper mapper, ILogger<PackingSlipController> logger)
        {
            _packingSlipService = packingSlipService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddPackingSlip([FromBody] PackingSlipRequestModel packingSlipRequest)
        {
            try
            {
                var packingSlip = _mapper.Map<PackingSlip>(packingSlipRequest);
                await _packingSlipService.AddPackingSlip(packingSlip);

                var packingSlipDto = _mapper.Map<PackingSlipDto>(packingSlip);
                _logger.LogInformation(LogMessages.PackingSlipCreated);
                AddResponseMessage(Response, LogMessages.PackingSlipCreated, packingSlipDto, true, HttpStatusCode.Created);
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
                var packingSlips = await _packingSlipService.GetAll();
                var packingSlipDtos = _mapper.Map<IEnumerable<PackingSlipDto>>(packingSlips);
                AddResponseMessage(Response, LogMessages.PackingSlipRetrieved, packingSlipDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetPackingSlipsWithoutDraftsByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetPackingSlipsWithoutDraftsByCompanyId(int companyId)
        {
            try
            {
                var packingSlips = await _packingSlipService.GetPackingSlipsWithoutDraftsByCompanyId(companyId);
                if (packingSlips != null)
                {
                    var packingSlipDtos = _mapper.Map<IEnumerable<PackingSlipDto>>(packingSlips);
                    AddResponseMessage(Response, LogMessages.PackingSlipRetrieved, packingSlipDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PackingSlipNotFound);
                    AddResponseMessage(Response, LogMessages.PackingSlipNotFound, null, true, HttpStatusCode.NotFound);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetPackingSlipsByUserId/{userId}")]
        public async Task<ApiResponseModel> GetPackingSlipsByUserId(int userId)
        {
            try
            {
                var packingSlips = await _packingSlipService.GetPackingSlipsByUserId(userId);
                if (packingSlips != null)
                {
                    var packingSlipDtos = _mapper.Map<IEnumerable<PackingSlipDto>>(packingSlips);
                    AddResponseMessage(Response, LogMessages.PackingSlipRetrieved, packingSlipDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PackingSlipNotFound);
                    AddResponseMessage(Response, LogMessages.PackingSlipNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{packingSlipId}")]
        public async Task<ApiResponseModel> GetPackingSlipByPackingSlipId(int packingSlipId)
        {
            try
            {
                var packingSlip = await _packingSlipService.GetPackingSlipByPackingSlipId(packingSlipId);
                if (packingSlip != null)
                {
                    var packingSlipDto = _mapper.Map<PackingSlipDto>(packingSlip);
                    AddResponseMessage(Response, LogMessages.PackingSlipRetrieved, packingSlipDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PackingSlipNotFound);
                    AddResponseMessage(Response, LogMessages.PackingSlipNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPatch("approve/{packingSlipId}")]
        public async Task<ApiResponseModel> ApprovePackingSlip(int packingSlipId, ApprovePackingSlipRequestModel approvePackingSlipRequest)
        {
            try
            {
                var existingPackingSlip = await _packingSlipService.GetPackingSlipByPackingSlipId(packingSlipId);
                if (existingPackingSlip == null)
                {
                    _logger.LogWarning(LogMessages.PackingSlipNotFound);
                    return AddResponseMessage(Response, LogMessages.PackingSlipNotFound, null, true, HttpStatusCode.NotFound);
                }

                var approvedPackingSlip = _mapper.Map<PackingSlip>(approvePackingSlipRequest);
                approvedPackingSlip.PackingSlipId = packingSlipId; 

                await _packingSlipService.ApprovePackingSlip(existingPackingSlip.PackingSlipId, approvedPackingSlip);

                _logger.LogInformation(LogMessages.PackingSlipApproved);
                return AddResponseMessage(Response, LogMessages.PackingSlipApproved, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPut("{packingSlipId}")]
        public async Task<ApiResponseModel> UpdatePackingSlip(int packingSlipId, PackingSlipRequestModel packingSlipRequest)
        {
            try
            {
                var existingPackingSlip = await _packingSlipService.GetPackingSlipByPackingSlipId(packingSlipId);
                if (existingPackingSlip == null)
                {
                    _logger.LogWarning(LogMessages.PackingSlipNotFound);
                    return AddResponseMessage(Response, LogMessages.PackingSlipNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedPackingSlip = _mapper.Map<PackingSlip>(packingSlipRequest);
                updatedPackingSlip.PackingSlipId = packingSlipId;
                updatedPackingSlip.ReferenceNo = existingPackingSlip.ReferenceNo; 

                await _packingSlipService.UpdatePackingSlip(existingPackingSlip.PackingSlipId, updatedPackingSlip);

                _logger.LogInformation(LogMessages.PackingSlipUpdated);
                return AddResponseMessage(Response, LogMessages.PackingSlipUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
