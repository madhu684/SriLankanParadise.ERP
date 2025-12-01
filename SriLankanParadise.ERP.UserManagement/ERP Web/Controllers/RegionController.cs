using AutoMapper;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/region")]
    public class RegionController : BaseApiController
    {
        private readonly IRegionService _regionService;
        private readonly IMapper _mapper;
        private readonly ILogger<RegionController> _logger;

        public RegionController(IRegionService regionService, IMapper mapper, ILogger<RegionController> logger)
        {
            _regionService = regionService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ApiResponseModel> GetAll()
        {
            try
            {
                var regions = await _regionService.GetAll();
                var dtos = _mapper.Map<IEnumerable<RegionDto>>(regions);
                AddResponseMessage(Response, "Regions retrieved successfully.", dtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving regions");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("{id}")]
        public async Task<ApiResponseModel> GetById(int id)
        {
            try
            {
                var region = await _regionService.GetById(id);
                if (region == null)
                {
                    AddResponseMessage(Response, "Region not found.", null, true, HttpStatusCode.NotFound);
                    return Response;
                }

                var dto = _mapper.Map<RegionDto>(region);
                AddResponseMessage(Response, "Region retrieved successfully.", dto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving region by ID");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }
    }
}
