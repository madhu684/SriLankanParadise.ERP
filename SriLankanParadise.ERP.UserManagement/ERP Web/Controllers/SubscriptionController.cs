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
    [Route("api/subscription")]
    public class SubscriptionController : BaseApiController
    {
        private readonly ISubscriptionService _subscriptionService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<SubscriptionController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SubscriptionController(
            ISubscriptionService subscriptionService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<SubscriptionController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _subscriptionService = subscriptionService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("{subscriptionId}")]
        public async Task<ApiResponseModel> GetSubscriptionBySubscriptionId(int subscriptionId)
        {
            try
            {
                var subscription = await _subscriptionService.GetSubscriptionBySubscriptionId(subscriptionId);
                if (subscription != null)
                {
                    var subscriptionDto = _mapper.Map<SubscriptionDto>(subscription);
                    AddResponseMessage(Response, LogMessages.SubscriptionRetrieved, subscriptionDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.SubscriptionNotFound);
                    AddResponseMessage(Response, LogMessages.SubscriptionNotFound, null, true, HttpStatusCode.NotFound);
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
                var subscriptions = await _subscriptionService.GetAll();
                var SubscriptionDtos = _mapper.Map<IEnumerable<SubscriptionDto>>(subscriptions);
                AddResponseMessage(Response, LogMessages.SubscriptionsRetrieved, SubscriptionDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddSubscription(SubscriptionRequestModel subscriptionRequest)
        {
            try
            {
                var Subscription = _mapper.Map<Subscription>(subscriptionRequest);
                await _subscriptionService.AddSubscription(Subscription);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = subscriptionRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SubscriptionCreated);
                AddResponseMessage(Response, LogMessages.SubscriptionCreated, null, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{subscriptionId}")]
        public async Task<ApiResponseModel> UpdateSubscription(int SubscriptionId, SubscriptionRequestModel subscriptionRequest)
        {
            try
            {
                var existingSubscription = await _subscriptionService.GetSubscriptionBySubscriptionId(SubscriptionId);
                if (existingSubscription == null)
                {
                    _logger.LogWarning(LogMessages.SubscriptionNotFound);
                    return AddResponseMessage(Response, LogMessages.SubscriptionNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedSubscription = _mapper.Map<Subscription>(subscriptionRequest);
                updatedSubscription.SubscriptionId = SubscriptionId; // Ensure the ID is not changed

                await _subscriptionService.UpdateSubscription(existingSubscription.SubscriptionId, updatedSubscription);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = subscriptionRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.SubscriptionUpdated);
                return AddResponseMessage(Response, LogMessages.SubscriptionUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        //[HttpDelete("{SubscriptionId}")]
        //public async Task<ApiResponseModel> DeleteSubscription(int SubscriptionId)
        //{
        //    try
        //    {
        //        var existingSubscription = await _subscriptionService.GetSubscriptionBySubscriptionId(SubscriptionId);
        //        if (existingSubscription == null)
        //        {
        //            _logger.LogWarning(LogMessages.SubscriptionNotFound);
        //            return ApiResponse.Error("Subscription not found", HttpStatusCode.NotFound);
        //        }

        //        await _subscriptionService.DeleteSubscription(SubscriptionId);
        //        _logger.LogInformation(LogMessages.SubscriptionDeleted);
        //        return ApiResponse.Success("Subscription deleted successfully", HttpStatusCode.NoContent);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, ErrorMessages.InternalServerError);
        //        return ApiResponse.Error(ex.Message, HttpStatusCode.InternalServerError);
        //    }
        //}
    }
}
