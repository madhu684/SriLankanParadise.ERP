using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;
using System.Net;
using SriLankanParadise.ERP.UserManagement.Shared.Resources;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/category")]
    public class CategoryController : BaseApiController
    {
        private readonly ICategoryService _categoryService;
        private readonly IActionLogService _actionLogService;
        private readonly IMapper _mapper;
        private readonly ILogger<CategoryController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CategoryController(
            ICategoryService categoryService,
            IActionLogService actionLogService,
            IMapper mapper,
            ILogger<CategoryController> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            _categoryService = categoryService;
            _actionLogService = actionLogService;
            _mapper = mapper;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<ApiResponseModel> AddCategory(CategoryRequestModel categoryRequest)
        {
            try
            {
                var category = _mapper.Map<Category>(categoryRequest);
                await _categoryService.AddCategory(category);

                // Create action log
                var actionLog = new ActionLogModel()
                {
                    ActionId = categoryRequest.PermissionId,
                    UserId = Int32.Parse(HttpContext.User.Identity.Name),
                    Ipaddress = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString(),
                    Timestamp = DateTime.UtcNow
                };
                await _actionLogService.CreateActionLog(_mapper.Map<ActionLog>(actionLog));

                // send response
                var categoryDto = _mapper.Map<CategoryDto>(category);
                _logger.LogInformation(LogMessages.CategoryCreated);
                AddResponseMessage(Response, LogMessages.CategoryCreated, categoryDto, true, HttpStatusCode.Created);
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
                var categories = await _categoryService.GetAll();
                var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);
                AddResponseMessage(Response, LogMessages.CategoriesRetrieved, categoryDtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ErrorMessages.InternalServerError);
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetCategoriesByCompanyId/{companyId}")]
        public async Task<ApiResponseModel> GetCategoriesByCompanyId(int companyId)
        {
            try
            {
                var categories = await _categoryService.GetCategoriesByCompanyId(companyId);
                if (categories != null)
                {
                    var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);
                    AddResponseMessage(Response, LogMessages.CategoriesRetrieved, categoryDtos, true, HttpStatusCode.OK);
                }
                else
                {
                    _logger.LogWarning(LogMessages.CategoriesNotFound);
                    AddResponseMessage(Response, LogMessages.CategoriesNotFound, null, true, HttpStatusCode.NotFound);
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
