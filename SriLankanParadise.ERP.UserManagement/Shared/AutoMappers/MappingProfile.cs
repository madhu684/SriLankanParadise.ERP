using AutoMapper;
using SriLankanParadise.ERP.UserManagement.ERP_Web.DTOs;
using SriLankanParadise.ERP.UserManagement.Models;

namespace SriLankanParadise.ERP.UserManagement.Shared.AutoMappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<Company, CompanyDto>();
            // Add more mapping configurations if needed
        }
    }

}
