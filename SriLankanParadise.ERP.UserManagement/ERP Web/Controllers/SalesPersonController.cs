using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.ResponseModels;

namespace SriLankanParadise.ERP.UserManagement.ERP_Web.Controllers
{
    [ApiController]
    [Route("api/salesperson")]
    public class SalesPersonController : BaseApiController
    {
        private readonly ISalesPersonService _salesPersonService;
        private readonly ILogger<SalesPersonController> _logger;
        private readonly IMapper _mapper;

        public SalesPersonController(
            ISalesPersonService salesPersonService,
            ILogger<SalesPersonController> logger,
            IMapper mapper)
        {
            _salesPersonService = salesPersonService;
            _logger = logger;
            _mapper = mapper;
        }

        // **************************************************
        // POST: Create SalesPerson
        // **************************************************
        [HttpPost]
        public async Task<ApiResponseModel> AddSalesPerson(SalesPersonRequestModel request)
        {
            try
            {
                var salesPerson = _mapper.Map<SalesPerson>(request);
                salesPerson.CreatedDate = DateTime.Now;

                await _salesPersonService.AddSalesPerson(salesPerson);

                var dto = _mapper.Map<SalesPersonDto>(salesPerson);
                AddResponseMessage(Response, "SalesPerson created successfully.", dto, true, HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating SalesPerson");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        // **************************************************
        // GET: Get All
        // **************************************************
        [HttpGet]
        public async Task<ApiResponseModel> GetAll()
        {
            try
            {
                var persons = await _salesPersonService.GetAll();
                var dtos = _mapper.Map<IEnumerable<SalesPersonDto>>(persons);

                AddResponseMessage(Response, "SalesPersons retrieved successfully.", dtos, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving SalesPersons");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }

        // **************************************************
        // GET: Get By Id
        // **************************************************
        [HttpGet("{id}")]
        public async Task<ApiResponseModel> GetById(int id)
        {
            try
            {
                var person = await _salesPersonService.GetById(id);

                if (person == null)
                {
                    AddResponseMessage(Response, "SalesPerson not found.", null, true, HttpStatusCode.NotFound);
                    return Response;
                }

                var dto = _mapper.Map<SalesPersonDto>(person);
                AddResponseMessage(Response, "SalesPerson retrieved.", dto, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving SalesPerson by ID");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }
            return Response;
        }

        // **************************************************
        // PUT: Full Update
        // **************************************************
        [HttpPut("{id}")]
        public async Task<ApiResponseModel> Update(int id, SalesPersonRequestModel request)
        {
            try
            {
                var existing = await _salesPersonService.GetById(id);

                if (existing == null)
                {
                    AddResponseMessage(Response, "SalesPerson not found.", null, true, HttpStatusCode.NotFound);
                    return Response;
                }

                var toUpdate = _mapper.Map<SalesPerson>(request);
                toUpdate.SalesPersonId = id;

                await _salesPersonService.Update(id, toUpdate);

                AddResponseMessage(Response, "SalesPerson updated successfully.", null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating SalesPerson");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }

        // **************************************************
        // PATCH: Partial Update (ContactNo, Email, IsActive)
        // **************************************************
        [HttpPatch("{id}")]
        public async Task<ApiResponseModel> Patch(int id, SalesPersonPatchRequestModel request)
        {
            try
            {
                var existing = await _salesPersonService.GetById(id);

                if (existing == null)
                {
                    AddResponseMessage(Response, "SalesPerson not found.", null, true, HttpStatusCode.NotFound);
                    return Response;
                }

                if (request.ContactNo != null) existing.ContactNo = request.ContactNo;
                if (request.Email != null) existing.Email = request.Email;
                if (request.IsActive.HasValue) existing.IsActive = request.IsActive.Value;

                await _salesPersonService.Update(id, existing);

                AddResponseMessage(Response, "SalesPerson partially updated.", null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error patching SalesPerson");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }

        // **************************************************
        // DELETE: Delete SalesPerson
        // (Soft delete OR hard delete — choose based on your service)
        // **************************************************
        [HttpDelete("{id}")]
        public async Task<ApiResponseModel> Delete(int id)
        {
            try
            {
                var existing = await _salesPersonService.GetById(id);

                if (existing == null)
                {
                    AddResponseMessage(Response, "SalesPerson not found.", null, true, HttpStatusCode.NotFound);
                    return Response;
                }

                await _salesPersonService.Delete(id);

                AddResponseMessage(Response, "SalesPerson deleted successfully.", null, true, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting SalesPerson");
                AddResponseMessage(Response, ex.Message, null, false, HttpStatusCode.InternalServerError);
            }

            return Response;
        }
    }
}
