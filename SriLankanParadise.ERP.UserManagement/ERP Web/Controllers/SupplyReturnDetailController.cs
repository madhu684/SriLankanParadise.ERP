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
    [Route("api/supplyReturnDetail")]
    public class SupplyReturnDetailController : BaseApiController
    {
        private readonly ISupplyReturnDetailService _supplyReturnDetailService;
        private readonly ILogger<SupplyReturnDetailController> _logger;
        private readonly IMapper _mapper;

        public SupplyReturnDetailController(ISupplyReturnDetailService supplyReturnDetailService, ILogger<SupplyReturnDetailController> logger, IMapper mapper)
        {
            _supplyReturnDetailService = supplyReturnDetailService;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSupplyReturnDetail(SupplyReturnDetailRequestModel supplyReturnDetailRequestModel)
        {
            try
            {
                var supplyDetail = _mapper.Map<SupplyReturnDetail>(supplyReturnDetailRequestModel);
                await _supplyReturnDetailService.AddSupplyReturnDetail(supplyDetail);

                var supplyDetailDto = _mapper.Map<SupplyReturnDetailDto>(supplyDetail);
                _logger.LogInformation(LogMessages.SupplyReturnDetailCreated);
                AddResponseMessage(Response, LogMessages.SupplyReturnDetailCreated, supplyDetailDto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{supplyReturnDetailId}")]
        public async Task<ApiResponseModel> UpdateSupplyReturnDetail(int supplyReturnDetailId, SupplyReturnDetailRequestModel supplyReturnDetailRequestModel)
        {
            try
            {
                var existSupplyReturnDetail = await _supplyReturnDetailService.GetSupplyReturnDetailByReturnId(supplyReturnDetailId);

                if (existSupplyReturnDetail == null)
                {
                    _logger.LogWarning(LogMessages.SupplyReturnDetailNotFound);
                    AddResponseMessage(Response, LogMessages.SupplyReturnDetailNotFound, null, true, HttpStatusCode.NotFound);
                }
                else
                {
                    var updatedSupplyReturnDetail = _mapper.Map<SupplyReturnDetail>(supplyReturnDetailRequestModel);
                    updatedSupplyReturnDetail.SupplyReturnDetailId = supplyReturnDetailId;

                    await _supplyReturnDetailService.UpdateSupplyReturnDetail(updatedSupplyReturnDetail.SupplyReturnDetailId, updatedSupplyReturnDetail);

                    _logger.LogInformation(LogMessages.SupplyReturnDetailUpdated);
                    AddResponseMessage(Response, LogMessages.SupplyReturnDetailUpdated, null, true, HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpDelete("{supplyReturnDetailId}")]
        public async Task<ApiResponseModel> DeleteSupplyReturnDetail(int supplyReturnDetailId)
        {
            try
            {
                var existSupplyReturnDetail = await _supplyReturnDetailService.GetSupplyReturnDetailByReturnId(supplyReturnDetailId);

                if (existSupplyReturnDetail == null)
                {
                    _logger.LogWarning(LogMessages.SupplyReturnDetailNotFound);
                    AddResponseMessage(Response, LogMessages.SupplyReturnDetailNotFound, null, true, HttpStatusCode.NotFound);
                }
                else
                {
                    await _supplyReturnDetailService.DeleteSupplyReturnDetail(supplyReturnDetailId);

                    _logger.LogInformation(LogMessages.SupplyReturnDetailDeleted);
                    AddResponseMessage(Response, LogMessages.SupplyReturnDetailDeleted, null, true, HttpStatusCode.NoContent);
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
