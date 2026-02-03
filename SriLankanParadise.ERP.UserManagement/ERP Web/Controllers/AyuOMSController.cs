using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/ayuOMS")]
    public class AyuOMSController : BaseApiController
    {
        private readonly IAyuOMSService _ayuOMSService;
        private readonly ILogger<AyuOMSController> _logger;

        public AyuOMSController(IAyuOMSService ayuOMSService, ILogger<AyuOMSController> logger)
        {
            _ayuOMSService = ayuOMSService;
            _logger = logger;
        }

        [HttpGet("GetTokensByDate")]
        public async Task<ApiResponseModel> GetTokensByDate([FromQuery] int companyId, [FromQuery] DateTime date)
        {
            try
            {
                var tokens = await _ayuOMSService.GetAppointmentScheduleByDateAsync(companyId, date);
                AddResponseMessage(Response, "Tokens retrieved successfully.", tokens, true, System.Net.HttpStatusCode.OK);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error retrieving tokens for date: {Date} company: {CompanyId}", date, companyId);
                AddResponseMessage(Response, "Failed to retrieve tokens from external service.", null, false, System.Net.HttpStatusCode.BadGateway);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tokens for date: {Date} company: {CompanyId}", date, companyId);
                AddResponseMessage(Response, "An error occurred while retrieving tokens.", null, false, System.Net.HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        [HttpGet("GetAppointmentById/{id}")]
        public async Task<ApiResponseModel> GetAppointmentById([FromQuery] int companyId, int id)
        {
            try
            {
                var appointment = await _ayuOMSService.GetAppointmentDetailsByIdAsync(companyId, id);
                AddResponseMessage(Response, "Appointment details retrieved successfully.", appointment, true, System.Net.HttpStatusCode.OK);
            }
            catch (HttpRequestException ex)
            {
                if (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    AddResponseMessage(Response, $"Appointment with ID {id} not found.", null, false, System.Net.HttpStatusCode.NotFound);
                }
                else
                {
                    AddResponseMessage(Response, "Failed to retrieve appointment from external service.", null, false, System.Net.HttpStatusCode.BadGateway);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving appointment for ID: {Id} company: {CompanyId}", id, companyId);
                AddResponseMessage(Response, "An error occurred while retrieving appointment details.", null, false, System.Net.HttpStatusCode.InternalServerError);
            }
            return Response;
        }
    }
}
