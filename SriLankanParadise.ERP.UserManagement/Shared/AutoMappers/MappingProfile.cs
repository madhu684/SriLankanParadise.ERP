﻿using AutoMapper;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Models.RequestModels;

namespace SriLankanParadise.ERP.UserManagement.Shared.AutoMappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<Company, CompanyDto>();
            CreateMap<Subscription, SubscriptionDto>();
            CreateMap<Module, ModuleDto>();
            CreateMap<CompanySubscriptionModule, CompanySubscriptionModuleDto>();
            CreateMap<UserRegistrationModel, User>();
            CreateMap<ActionLogModel, ActionLog>();
            CreateMap<CompanyRequestModel, Company>();
            CreateMap<SubscriptionRequestModel, Subscription>();
            CreateMap<ModuleRequestModel, Module>();
            CreateMap<CompanySubscriptionModuleRequestModel, CompanySubscriptionModule>();
            CreateMap<Module, ModuleWithIdDto>();
            CreateMap<Role, RoleDto>();
            CreateMap<Permission, PermissionDto>();
            CreateMap<UserRoleRequestModel, UserRole>();
            CreateMap<UserPermissionRequestModel, UserPermission>();
            CreateMap<RolePermissionRequestModel, RolePermission>();
            CreateMap<CompanySubscriptionModuleUserRequestModel, CompanySubscriptionModuleUser>();
            CreateMap<SubModule, SubModuleDto>();
            CreateMap<SubModule, SubModuleWithIdDto>();
            CreateMap<SubModuleRequestModel, SubModule>();
            // Add more mapping configurations if needed
        }
    }

}
