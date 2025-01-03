﻿using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class IssueDetailService : IIssueDetailService
    {
        private readonly IIssueDetailRepository _issueDetailRepository;
        public IssueDetailService(IIssueDetailRepository issueDetailRepository)
        {
            _issueDetailRepository = issueDetailRepository;
        }

        public async Task AddIssueDetail(IssueDetail issueDetail)
        {
            await _issueDetailRepository.AddIssueDetail(issueDetail);
        }

        public async Task<IEnumerable<IssueDetail>> GetIssueDetails(int issueMasterId)
        {
            return await _issueDetailRepository.GetIssueDetails(issueMasterId);
        }
    }
}
