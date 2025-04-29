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
    [Route("api/userGeoLocation")]
    public class UserGeoLocationController : BaseApiController
    {
        private readonly IUserGeoLocationService _userGeoLocationService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserGeoLocationController> _logger;

        public UserGeoLocationController(IUserGeoLocationService userGeoLocationService, IMapper mapper, ILogger<UserGeoLocationController> logger)
        {
            _userGeoLocationService = userGeoLocationService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ApiResponseModel> CreateAsync([FromBody] UserGeoLocationRequestModel userGeoLocationRequestModel)
        {
            try
            {
                var userGeoLocation = _mapper.Map<UserGeoLocation>(userGeoLocationRequestModel);
                await _userGeoLocationService.CreateGeoLocation(userGeoLocation);

                var userGeoLocationDto = _mapper.Map<UserGeoLocationDto>(userGeoLocation);
                AddResponseMessage(Response, LogMessages.UserGeoLocationCreated, userGeoLocationDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }

        [HttpGet]
        public async Task<ApiResponseModel> GetAllAsync()
        {
            try
            {
                var userGeoLocations = await _userGeoLocationService.GetAllAsync();
                var userGeoLocationDtos = _mapper.Map<IEnumerable<UserGeoLocationDto>>(userGeoLocations);
                AddResponseMessage(Response, LogMessages.UserGeoLocationsRetrieved, userGeoLocationDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }

        [HttpGet("GetByGeoDate/{date}")]
        public async Task<ApiResponseModel> GetByDateAsync(DateTime date)
        {
            try
            {
                var userGeoLocations = await _userGeoLocationService.GetByDateAsync(date);
                var userGeoLocationDtos = _mapper.Map<IEnumerable<UserGeoLocationDto>>(userGeoLocations);
                AddResponseMessage(Response, LogMessages.UserGeoLocationsRetrieved, userGeoLocationDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }


        [HttpGet("GetByUserId/{userId}")]
        public async Task<ApiResponseModel> GetByUserIdAsync(int userId)
        {
            try
            {
                var userGeoLocations = await _userGeoLocationService.GetByUserIdAsync(userId);
                var userGeoLocationDtos = _mapper.Map<IEnumerable<UserGeoLocationDto>>(userGeoLocations);
                AddResponseMessage(Response, LogMessages.UserGeoLocationsRetrieved, userGeoLocationDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }


        [HttpGet("GetByUserIdAndDate/{userId}/{date}")]
        public async Task<ApiResponseModel> GetByUserIdAndDateAsync(int userId, DateTime date)
        {
            try
            {
                var userGeoLocations = await _userGeoLocationService.GetByUserIdAndDateAsync(userId, date);
                var userGeoLocationDtos = _mapper.Map<IEnumerable<UserGeoLocationDto>>(userGeoLocations);
                AddResponseMessage(Response, LogMessages.UserGeoLocationsRetrieved, userGeoLocationDtos, true, HttpStatusCode.OK);
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