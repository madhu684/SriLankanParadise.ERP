using AutoMapper;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class EmptyReturnService : IEmptyReturnService
    {
        private readonly IEmptyReturnRepository _emptyReturnRepository;
        private readonly ErpSystemContext _dbContext;
        private readonly IMapper _mapper;

        public EmptyReturnService(IEmptyReturnRepository emptyReturnRepository, ErpSystemContext dbContext, IMapper mapper)
        {
            _emptyReturnRepository = emptyReturnRepository;
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<EmptyReturnMaster> AddEmptyReturnAsync(AddEmptyReturnRequestModel requestModel)
        {
            var masterEntity = _mapper.Map<EmptyReturnMaster>(requestModel);
            masterEntity.CreateDate = DateTime.UtcNow;

            var detailEntities = requestModel.EmptyReturnDetails.Select(detail =>
            {
                var entity = _mapper.Map<EmptyReturnDetail>(detail);
                return entity;
            }).ToList();

            // Call the repo (which will handle transaction)
            var data = await _emptyReturnRepository.AddEmptyReturnAsync(masterEntity);
            return data;
        }

        public async Task<IEnumerable<EmptyReturnMaster>> GetEmptyReturnsAsync(int companyId)
        {
            return await _emptyReturnRepository.GetEmptyReturnsByCompanyAsync(companyId);
        }
        public async Task<EmptyReturnMaster> GetEmptyReturnMasterById(int id)
        {
            return await _emptyReturnRepository.GetEmptyReturnMasterById(id);
        }

        //public async Task UpdateEmptyReturnMasterAndDetails(EmptyReturnMaster updatedMaster)
        //{
        //    await _emptyReturnRepository.UpdateEmptyReturnMasterAndDetails(updatedMaster);
        //}

        public async Task UpdateEmptyReturnMasterAndDetails(int emptyReturnMasterId, UpdateEmptyReturnRequestModel requestModel)
        {
            await _emptyReturnRepository.UpdateEmptyReturnMasterAndDetails(emptyReturnMasterId, requestModel);
        }
        public async Task<bool> ApproveEmptyReturnMaster(int emptyReturnMasterId, ApproveEmptyReturnRequestModel request)
        {
            return await _emptyReturnRepository.ApproveEmptyReturnMaster(emptyReturnMasterId, request);
        }



    }
}
