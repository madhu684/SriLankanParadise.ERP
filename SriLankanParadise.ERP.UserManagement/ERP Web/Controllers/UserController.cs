using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/login")]
    public class UserController : BaseApiController
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }
        [HttpPost]
        public async Task<ApiResponseModel> Login(UserRequestModel userRequestModel)
        {
            try
            {
                var user = await _userService.GetUserByUsername(userRequestModel.Username);

                if (user == null)
                {
                    AddResponseMessage(Response, "Invalid username or password", null, true, HttpStatusCode.NotFound);
                }
                else
                {
                    // Compare the hashed password
                    if (!_userService.VerifyPassword(userRequestModel.Password, user.PasswordHash))
                    {
                        AddResponseMessage(Response, "Invalid username or password", null, true, HttpStatusCode.NotFound);
                    }
                    else
                    {
                        // User is authenticated. Check the subscription
                        if (!_userService.VerifyExpiryDate(user.Company.SubscriptionExpiredDate))
                        {
                            AddResponseMessage(Response, "Subscription Expired", null, true, HttpStatusCode.BadRequest);
                        }
                        else
                        {
                            var userDto = _mapper.Map<UserDto>(user);
                            AddResponseMessage(Response, "User logged in successfully", userDto, true, HttpStatusCode.OK);
                        }
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
                return Response;
            }
        }
    }
}
