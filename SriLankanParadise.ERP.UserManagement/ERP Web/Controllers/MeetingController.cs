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
    [Route("api/meeting")]
    [ApiController]
    public class MeetingController : BaseApiController
    {
        private readonly IMeetingService _meetingService;
        private readonly ILogger<MeetingController> _logger;
        private readonly IMapper _mapper;

        public MeetingController(IMeetingService meetingService, ILogger<MeetingController> logger, IMapper mapper)
        {
            _meetingService = meetingService;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ApiResponseModel> GetAllMeetings()
        {
            try
            {
                var meetings = await _meetingService.GetAllMeetingsAsync();
                var meetingDtos = _mapper.Map<IEnumerable<MeetingDto>>(meetings);
                AddResponseMessage(Response, LogMessages.MeetingsRetrieved, meetingDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{meetingId}")]
        public async Task<ApiResponseModel> GetMeetingById(int meetingId)
        {
            try
            {
                var meeting = await _meetingService.GetMeetingByIdAsync(meetingId);
                var meetingDto = _mapper.Map<MeetingDto>(meeting);
                AddResponseMessage(Response, LogMessages.MeetingsRetrieved, meetingDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPost]
        public async Task<ApiResponseModel> CreateMeeting(MeetingRequestModel meetingRequest)
        {
            try
            {
                var meeting = _mapper.Map<Meeting>(meetingRequest);
                await _meetingService.AddMeetingAsync(meeting);

                var meetingDto = _mapper.Map<MeetingDto>(meeting);
                AddResponseMessage(Response, LogMessages.MeetingCreated, meetingDto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{meetingId}")]
        public async Task<ApiResponseModel> UpdateMeeting(int meetingId, MeetingRequestModel meetingRequest)
        {
            try
            {
                var existingMeeting = await _meetingService.GetMeetingByIdAsync(meetingId);
                if (existingMeeting == null)
                {
                    _logger.LogWarning(LogMessages.MeetingNotFound);
                    return AddResponseMessage(Response, LogMessages.MeetingNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedMeeting = _mapper.Map<Meeting>(meetingRequest);
                updatedMeeting.MeetingId = meetingId; 

                await _meetingService.UpdateMeetingAsync(existingMeeting.MeetingId, updatedMeeting);

                _logger.LogInformation(LogMessages. MeetingUpdated);
                return AddResponseMessage(Response, LogMessages.MeetingUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{meetingId}")]
        public async Task<ApiResponseModel> DeleteMeeting(int meetingId)
        {
            try
            {
                var exsistingMeeting = await _meetingService.GetMeetingByIdAsync(meetingId);
                if (exsistingMeeting == null)
                {
                    _logger.LogWarning(LogMessages.MeetingNotFound);
                    return AddResponseMessage(Response, LogMessages.MeetingNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _meetingService.DeleteMeetingAsync(meetingId);

                _logger.LogInformation(LogMessages.MeetingDeleted);
                return AddResponseMessage(Response, LogMessages.MeetingDeleted, null, true, HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}