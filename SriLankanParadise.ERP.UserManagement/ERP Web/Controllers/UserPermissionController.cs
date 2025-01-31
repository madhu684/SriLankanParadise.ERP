﻿using AutoMapper;
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
    [Route("api/userPermission")]
    public class UserPermissionController : BaseApiController
    {
        private readonly IUserPermissionService _userPermissionService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserPermissionController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserPermissionController(
            IUserPermissionService userPermissionService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<UserPermissionController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _userPermissionService = userPermissionService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddUserPermission(UserPermissionRequestModel userPermissionRequest)
        {
            try
            {
                var userPermission = _mapper.Map<UserPermission>(userPermissionRequest);
                await _userPermissionService.AddUserPermission(userPermission);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = userPermissionRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.UserPermissionCreated);
                AddResponseMessage(Response, LogMessages.UserPermissionCreated, null, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetUserPermissionsByUserId")]
        public async Task<ApiResponseModel> GetUserPermissionByUserId(int userId)
        {
            try
            {
                var userPermissions = await _userPermissionService.GetUserPermissionsByUserId(userId);
                if (userPermissions != null)
                {
                    var userPermissionDtos = _mapper.Map<IEnumerable<UserPermissionDto>>(userPermissions);
                    AddResponseMessage(Response, LogMessages.UserPermissionsRetrieved, userPermissionDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.UserPermissionsNotFound);
                    AddResponseMessage(Response, LogMessages.UserPermissionsNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("UpdateUserPermissions/{userId}")]
        public async Task<ApiResponseModel> UpdateUserPermissions([FromRoute] int userId, [FromBody] int[] permissionIds)
        {
            try
            {
                await _userPermissionService.DeleteUserPermissions(userId);

                foreach (var permissionId in permissionIds)
                {
                    var userPermission = new UserPermission()
                    {
                        UserId = userId,
                        PermissionId = permissionId
                    };

                    await _userPermissionService.AddUserPermission(userPermission);
                }

                _logger.LogInformation(LogMessages.UserPermissionsUpdated);
                AddResponseMessage(Response, LogMessages.UserPermissionsUpdated, null, true, HttpStatusCode.OK);
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
