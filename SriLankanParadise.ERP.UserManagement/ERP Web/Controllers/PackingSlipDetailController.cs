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
    [Route("api/packingSlipDetail")]
    public class PackingSlipDetailController : BaseApiController
    {
        private readonly IPackingSlipDetailService _packingSlipDetailService;
        private readonly IMapper _mapper;
        private readonly ILogger<PackingSlipDetailController> _logger;

        public PackingSlipDetailController(
            IPackingSlipDetailService packingSlipDetailService,
            IMapper mapper,
            ILogger<PackingSlipDetailController> logger)
        {
            _packingSlipDetailService = packingSlipDetailService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet("GetPackingSlipDetailsByPackingSlipId/{packingSlipId}")]
        public async Task<ApiResponseModel> GetPackingSlipDetailsByPackingSlipId(int packingSlipId)
        {
            try
            {
                var packingSlipDetails = await _packingSlipDetailService.GetPackingSlipDetailsByPackingSlipId(packingSlipId);
                if (packingSlipDetails != null)
                {
                    var packingSlipDetailsDto = _mapper.Map<List<PackingSlipDetailDto>>(packingSlipDetails);
                    AddResponseMessage(Response, LogMessages.PackingSlipDetailRetrieved, packingSlipDetailsDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.PackingSlipDetailNotFound);
                    AddResponseMessage(Response, LogMessages.PackingSlipDetailNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddPackingSlipDetail(PackingSlipDetailRequestModel packingSlipDetailRequest)
        {
            try
            {
                var packingSlipDetail = _mapper.Map<PackingSlipDetail>(packingSlipDetailRequest);
                await _packingSlipDetailService.AddPackingSlipDetail(packingSlipDetail);

                var packingSlipDetailDto = _mapper.Map<PackingSlipDetailDto>(packingSlipDetail);
                _logger.LogInformation(LogMessages.PackingSlipDetailCreated);
                AddResponseMessage(Response, LogMessages.PackingSlipDetailCreated, packingSlipDetailDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{packingSlipDetailId}")]
        public async Task<ApiResponseModel> UpdatePackingSlipDetail(int packingSlipDetailId, PackingSlipDetailRequestModel packingSlipDetailRequest)
        {
            try
            {
                var existingPackingSlipDetail = await _packingSlipDetailService.GetPackingSlipDetailByPackingSlipDetailId(packingSlipDetailId);
                if (existingPackingSlipDetail == null)
                {
                    _logger.LogWarning(LogMessages.PackingSlipDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.PackingSlipDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedPackingSlipDetail = _mapper.Map<PackingSlipDetail>(packingSlipDetailRequest);
                updatedPackingSlipDetail.PackingSlipDetailId = packingSlipDetailId; 

                await _packingSlipDetailService.UpdatePackingSlipDetail(existingPackingSlipDetail.PackingSlipDetailId, updatedPackingSlipDetail);

                _logger.LogInformation(LogMessages.PackingSlipDetailUpdated);
                return AddResponseMessage(Response, LogMessages.PackingSlipDetailUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{packingSlipDetailId}")]
        public async Task<ApiResponseModel> DeletePackingSlipDetail(int packingSlipDetailId)
        {
            try
            {
                var existingPackingSlipDetail = await _packingSlipDetailService.GetPackingSlipDetailByPackingSlipDetailId(packingSlipDetailId);
                if (existingPackingSlipDetail == null)
                {
                    _logger.LogWarning(LogMessages.PackingSlipDetailNotFound);
                    return AddResponseMessage(Response, LogMessages.PackingSlipDetailNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _packingSlipDetailService.DeletePackingSlipDetail(packingSlipDetailId);

                _logger.LogInformation(LogMessages.PackingSlipDetailDeleted);
                return AddResponseMessage(Response, LogMessages.PackingSlipDetailDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
