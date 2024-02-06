using AutoMapper;
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
            CreateMap<UserPermission, UserPermissionDto>();
            CreateMap<RolePermissionRequestModel, RolePermission>();
            CreateMap<CompanySubscriptionModuleUserRequestModel, CompanySubscriptionModuleUser>();
            CreateMap<SubModule, SubModuleDto>();
            CreateMap<SubModule, SubModuleWithIdDto>();
            CreateMap<SubModuleRequestModel, SubModule>();
            CreateMap<PurchaseRequisitionRequestModel, PurchaseRequisition>();
            CreateMap<ApprovePurchaseRequisitionRequestModel, PurchaseRequisition>();
            CreateMap<PurchaseRequisition, PurchaseRequisitionDto>();
            CreateMap<PurchaseRequisitionDetailRequestModel, PurchaseRequisitionDetail>();
            CreateMap<PurchaseRequisitionDetail, PurchaseRequisitionDetailDto>();
            CreateMap<PurchaseOrderRequestModel, PurchaseOrder>();
            CreateMap<PurchaseOrder, PurchaseOrderDto>();
            CreateMap<PurchaseOrderDetailRequestModel, PurchaseOrderDetail>();
            CreateMap<PurchaseOrderDetail, PurchaseOrderDetailDto>();
            CreateMap<ApprovePurchaseOrderRequestModel, PurchaseOrder>();
            CreateMap<GrnMasterRequestModel, GrnMaster>();
            CreateMap<GrnMaster, GrnMasterDto>();
            CreateMap<ApproveGrnMasterRequestModel, GrnMaster>();
            CreateMap<GrnDetailRequestModel, GrnDetail>();
            CreateMap<GrnDetail, GrnDetailDto>();
            CreateMap<Location, LocationDto>();
            CreateMap<Supplier, SupplierDto>();
            CreateMap<CustomerRequestModel, Customer>();
            CreateMap<Customer, CustomerDto>();
            CreateMap<SalesOrderRequestModel, SalesOrder>();
            CreateMap<SalesOrder, SalesOrderDto>();
            CreateMap<SalesOrderDetailRequestModel, SalesOrderDetail>();
            CreateMap<SalesOrderDetail, SalesOrderDetailDto>();
            CreateMap<ApproveSalesOrderRequestModel, SalesOrder>();
            CreateMap<SalesInvoiceRequestModel, SalesInvoice>();
            CreateMap<SalesInvoice, SalesInvoiceDto>();
            CreateMap<SalesInvoiceDetailRequestModel, SalesInvoiceDetail>();
            CreateMap<SalesInvoiceDetail, SalesInvoiceDetailDto>();
            CreateMap<ApproveSalesInvoiceRequestModel, SalesInvoice>();
            // Add more mapping configurations if needed
        }
    }

}
