using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserController> _logger;
        private readonly IActionLogService _actionLogService;
        private readonly IAuditLogService _auditLogService;
        private readonly ICompanyService _companyService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(IConfiguration configuration,IUserService userService, IActionLogService actionLogService, IAuditLogService auditLogService, ICompanyService companyService, IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogger<UserController> logger)
        {
            _configuration = configuration;
            _userService = userService;
            _actionLogService = actionLogService;
            _auditLogService = auditLogService;
            _companyService = companyService;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
        }

        [HttpPost("login")]
        [AllowAnonymous]
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
                            // Create SessionId
                            var sessionId = Guid.NewGuid();

                            var token = GenerateJwtToken(user, sessionId);

                            // Map user to DTO
                            var userDto = _mapper.Map<UserDto>(user);

                            // Add token to DTO (make sure AccessToken is a string property in UserDto)
                            userDto.AccessToken = token;

                            //Manually create audit log on logging

                            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                            var auditLogOnLogin = new AuditLog
                            {
                                UserId = userDto.UserId,
                                SessionId = sessionId,
                                AccessedPath = "/api/User/login",
                                AccessedMethod = "POST",
                                Timestamp = DateTime.UtcNow,
                                Ipaddress = ipAddress,
                                Description = "User login"
                            };

                            await _auditLogService.CreateAuditLog(auditLogOnLogin);

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

        private string GenerateJwtToken(User user, Guid sessionId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim("CompanyId", user.CompanyId.ToString()),
                new Claim("FirstName", user.Firstname ?? ""),
                new Claim("LastName", user.Lastname ?? ""),
                new Claim("SessionId", sessionId.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["JwtSettings:ExpiryMinutes"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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
        public async Task<ApiResponseModel> Logout()
        {
            var userId = User?.Identity?.Name ?? "Unknown";
            _logger.LogInformation($"User {userId} logged out at {DateTime.UtcNow}");
            return AddResponseMessage(Response, "User log out", null, true, HttpStatusCode.OK);
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

        [HttpPut("deactivate/{userId}")]
        public async Task<ApiResponseModel> Deactivate(int userId)
        {
            try
            {
                var user = await _userService.GetUserByUserId(userId);

                if (user == null)
                {
                    _logger.LogWarning(LogMessages.UserNotFound);
                    return AddResponseMessage(Response, LogMessages.UserNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _userService.Deactivate(userId);
                _logger.LogInformation(LogMessages.UserDeactivated);
                return AddResponseMessage(Response, LogMessages.UserDeactivated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPut("activate/{userId}")]
        public async Task<ApiResponseModel> Activate(int userId)
        {
            try
            {
                var user = await _userService.GetUserByUserId(userId);

                if (user == null)
                {
                    _logger.LogWarning(LogMessages.UserNotFound);
                    return AddResponseMessage(Response, LogMessages.UserNotFound, null, true, HttpStatusCode.NotFound);
                }

                await _userService.Activate(userId);
                _logger.LogInformation(LogMessages.UserActivated);
                return AddResponseMessage(Response, LogMessages.UserActivated, null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPatch("reset-password/{userId}")]
        public async Task<ApiResponseModel> ForgotPassword(int userId, ForgetPasswordRequestModel request)
        {
            try
            {
                var success = await _userService.UpdatePasswordAsync(userId, request);
                if (!success)
                {
                    _logger.LogWarning("Invalid user credentials");
                    return AddResponseMessage(Response, "Invalid user credentials", null, true, HttpStatusCode.BadRequest);
                }

                _logger.LogInformation("Password updated successfully.");
                return AddResponseMessage(Response, "Password updated successfully", null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during password update.");
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }

        [HttpPatch("reset-password-admin/{userId}/{password}")]
        public async Task<ApiResponseModel> ResetPasswordAdmin(int userId, string password)
        {
            try
            {
                var success = await _userService.ResetPasswordAsync(userId, password);
                if (!success)
                {
                    _logger.LogWarning("Invalid user");
                    return AddResponseMessage(Response, "Invalid user", null, true, HttpStatusCode.BadRequest);
                }

                _logger.LogInformation("Password updated successfully.");
                return AddResponseMessage(Response, "Password updated successfully", null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during password update.");
                return AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
        }
    }
}
