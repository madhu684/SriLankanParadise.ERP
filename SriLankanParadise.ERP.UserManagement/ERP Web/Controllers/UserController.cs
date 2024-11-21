using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.Net;
using System.Security.Claims;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : BaseApiController
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserController> _logger;
        private readonly IActionLogService _actionLogService;
        private readonly ICompanyService _companyService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(IUserService userService, IActionLogService actionLogService, ICompanyService companyService, IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogger<UserController> logger)
        {
            _userService = userService;
            _actionLogService = actionLogService;
            _companyService = companyService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ApiResponseModel> Login(UserRequestModel userRequestModel)
        {
            try
            {
                var user = await _userService.GetUserByUsername(userRequestModel.Username);

                if (user == null)
                {
                    _logger.LogWarning(LogMessages.InvalidUsernameOrPassword);
                    AddResponseMessage(Response, LogMessages.InvalidUsernameOrPassword, null, true, HttpStatusCode.NotFound);
                }
                else
                {
                    // Compare the hashed password
                    if (!_userService.VerifyPassword(userRequestModel.Password, user.PasswordHash))
                    {
                        _logger.LogWarning(LogMessages.InvalidUsernameOrPassword);
                        AddResponseMessage(Response, LogMessages.InvalidUsernameOrPassword, null, true, HttpStatusCode.NotFound);
                    }
                    else
                    {
                        // User is authenticated. Check the subscription
                        if (!_userService.VerifyExpiryDate(user.Company.SubscriptionExpiredDate))
                        {
                            _logger.LogWarning(LogMessages.SubscriptionExpired);
                            AddResponseMessage(Response, LogMessages.SubscriptionExpired, null, true, HttpStatusCode.BadRequest);
                        }
                        else
                        {
                            var actionLog = await UserAuthentication(userRequestModel, user);
                            //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                            // Send response
                            var userDto = _mapper.Map<UserDto>(user);
                            _logger.LogInformation(LogMessages.UserAuthenticated);
                            AddResponseMessage(Response, LogMessages.UserAuthenticated, userDto, true, HttpStatusCode.OK);
                        }
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
                return Response;
            }
        }

        private async Task<ActionLogModel> UserAuthentication(UserRequestModel userRequestModel, User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserId.ToString()),
                // Add other claims if necessary
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity));

            // Create action log
            var actionLog = new ActionLogModel()
            {
                ActionId = userRequestModel.PermissionId,
                UserId = user.UserId,
                Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                Timestamp = DateTime.UtcNow
            };
            return actionLog;
        }

        [HttpPost("register")]
        public async Task<ApiResponseModel> Register(UserRegistrationModel userRegistrationModel)
        {
            try
            {
                // Check if a user with the same username already exists
                var existingUser = await _userService.GetUserByUsername(userRegistrationModel.Username);
                if (existingUser != null)
                {
                    _logger.LogWarning(LogMessages.UserAlreadyExists);
                    AddResponseMessage(Response, LogMessages.UserAlreadyExists, null, true, HttpStatusCode.BadRequest);
                    return Response;
                }

                //additional validations goes here - TO DO
                var company = _companyService.GetCompanyByCompanyId(userRegistrationModel.CompanyId);
                if (company != null)
                {
                    // Create a new user and save it to the database
                    var newUser = _mapper.Map<User>(userRegistrationModel);

                    // Hash the password using BCrypt
                    newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userRegistrationModel.Password);
                    newUser.Status = true;
                    await _userService.RegisterUser(newUser);

                    // Create action log
                    //var actionLog = new ActionLogModel()
                    //{
                    //    ActionId = userRegistrationModel.PermissionId,
                    //    UserId = newUser.UserId,
                    //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    //    Timestamp = DateTime.UtcNow
                    //};
                    //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                    var userDto = _mapper.Map<UserDto>(newUser);
                    _logger.LogInformation(LogMessages.UserRegistered);
                    AddResponseMessage(Response, LogMessages.UserRegistered, userDto, true, HttpStatusCode.Created);

                }
                else
                {
                    _logger.LogInformation(LogMessages.SubscriptionExpired);
                    AddResponseMessage(Response, LogMessages.SubscriptionExpired, null, true, HttpStatusCode.BadRequest);
                }
                return Response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
                return Response;
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok("Logged out");
        }

        [HttpGet("GetAllUsersByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetAllUsersByCompanyId(int companyId)
        {
            try
            {
                var users = await _userService.GetAllUsersByCompanyId(companyId);
                if (users != null)
                {
                    var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
                    AddResponseMessage(Response, LogMessages.UsersRetrieved, userDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.UsersNotFound);
                    AddResponseMessage(Response, LogMessages.UsersNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpPut("{userId}")]
        public async Task<ApiResponseModel> UpdateUser(int userId, UserUpdateRequestModel userUpdateRequest)
        {
            try
            {
                var existingUser = await _userService.GetUserByUserId(userId);

                if (existingUser == null)
                {
                    _logger.LogWarning(LogMessages.UserNotFound);
                    return AddResponseMessage(Response, LogMessages.UserNotFound, null, true, HttpStatusCode.NotFound);
                }

                var updatedUser = _mapper.Map<User>(userUpdateRequest);
                updatedUser.UserId = userId; // Ensure the ID is not changed
                updatedUser.PasswordHash = existingUser.PasswordHash;

                await _userService.UpdateUser(existingUser.UserId, updatedUser);

                // Create action log
                //var actionLog = new ActionLogModel()
                //{
                //    ActionId = userUpdateRequest.PermissionId,
                //    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                //    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                //    Timestamp = DateTime.UtcNow
                //};
                //await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                _logger.LogInformation(LogMessages.UserUpdated);
                return AddResponseMessage(Response, LogMessages.UserUpdated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("{userId}")]
        public async Task<ApiResponseModel> GetUserByUserId(int userId)
        {
            try
            {
                var user = await _userService.GetUserByUserId(userId);
                if (user != null)
                {
                    var userDto = _mapper.Map<UserDto>(user);
                    return AddResponseMessage(Response, LogMessages.UserRetrieved, userDto, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.UsersNotFound);
                    return AddResponseMessage(Response, LogMessages.UserNotFound, null, true, HttpStatusCode.NotFound);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpDelete("{userId}")]
        public async Task<ApiResponseModel> Delete(int userId)
        {
            try
            {
                var user = await _userService.GetUserByUserId(userId);

                if (user == null)
                {
                    _logger.LogWarning(LogMessages.UserNotFound);
                    return AddResponseMessage(Response, LogMessages.UserNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _userService.Delete(userId);
                _logger.LogInformation(LogMessages.UserDeleted);
                return AddResponseMessage(Response, LogMessages.UserDeleted, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
