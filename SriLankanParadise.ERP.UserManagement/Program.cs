using AutoMapper;
using Consul;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SriLankanParadise.ERP.UserManagement.Business_Service;
using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.ERP_Web.Middlewares;
using SriLankanParadise.ERP.UserManagement.Repository;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;
using SriLankanParadise.ERP.UserManagement.Shared.AutoMappers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

    options.Filters.Add(new AuthorizeFilter(policy));
});

// Register HttpContextAccessor
builder.Services.AddHttpContextAccessor();

//builder.Services.AddDateOnlyTimeOnlyStringConverters();

// Adding Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "User Auth", Version = "v1", Description = "Services to Authenticate user" });


    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Please enter a valid token in the following format: {your token here} do not add the word 'Bearer' before it."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// Allowed origins
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins(allowedOrigins) // Allow requests from this origin
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials(); // Allow cookies
    });
});

builder.Services.AddControllers().AddNewtonsoftJson(x =>
 x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);


// Read from config and configure JWT
var jwtKey = builder.Configuration["JwtSettings:Key"];
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"];
var jwtAudience = builder.Configuration["JwtSettings:Audience"];
var jwtExpiryMinutes = builder.Configuration["JwtSettings:ExpiryMinutes"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.HandleResponse();

            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";

            var result = JsonSerializer.Serialize(new
            {
                success = false,
                statusCode = StatusCodes.Status401Unauthorized,
                error = "You are not authorized to access this resource."
            });

            return context.Response.WriteAsync(result);
        },
        OnForbidden = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/json";

            var result = JsonSerializer.Serialize(new
            {
                success = false,
                statusCode = StatusCodes.Status403Forbidden,
                error = "You do not have permission to access this resource."
            });

            return context.Response.WriteAsync(result);
        }
    };
    options.RequireHttpsMetadata = false; // true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
    };
});


// database connection
var connectionString = builder.Configuration.GetConnectionString("LocalSqlServerConnection");

builder.Services.AddDbContext<ErpSystemContext>(options =>
    options.UseSqlServer(connectionString,
            sqlServerOptions => sqlServerOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null
            )));

// Register AutoMapper and create a mapping configuration
var mappingConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new MappingProfile());
});

IMapper mapper = mappingConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

// Configure and add a logger (console logger in this example)
builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole(); // You can add other logging providers here
});

//Enable forwarded header middleware
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IActionLogService, ActionLogService>();
builder.Services.AddScoped<IActionLogRepository, ActionLogRepository>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddScoped<IModuleService, ModuleService>();
builder.Services.AddScoped<IModuleRepository, ModuleRepository>();
builder.Services.AddScoped<ICompanySubscriptionModuleService, CompanySubscriptionModuleService>();
builder.Services.AddScoped<ICompanySubscriptionModuleRepository, CompanySubscriptionModuleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IUserPermissionService, UserPermissionService>();
builder.Services.AddScoped<IUserPermissionRepository, UserPermissionRepository>();
builder.Services.AddScoped<IRolePermissionService, RolePermissionService>();
builder.Services.AddScoped<IRolePermissionRepository, RolePermissionRepository>();
builder.Services.AddScoped<ICompanySubscriptionModuleUserService, CompanySubscriptionModuleUserService>();
builder.Services.AddScoped<ICompanySubscriptionModuleUserRepository, CompanySubscriptionModuleUserRepository>();
builder.Services.AddScoped<ISubModuleService, SubModuleService>();
builder.Services.AddScoped<ISubModuleRepository, SubModuleRepository>();
builder.Services.AddScoped<IPurchaseRequisitionService, PurchaseRequisitionService>();
builder.Services.AddScoped<IPurchaseRequisitionRepository, PurchaseRequisitionRepository>();
builder.Services.AddScoped<IPurchaseRequisitionDetailService, PurchaseRequisitionDetailService>();
builder.Services.AddScoped<IPurchaseRequisitionDetailRepository, PurchaseRequisitionDetailRepository>();
builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
builder.Services.AddScoped<IPurchaseOrderDetailService, PurchaseOrderDetailService>();
builder.Services.AddScoped<IPurchaseOrderDetailRepository, PurchaseOrderDetailRepository>();
builder.Services.AddScoped<IGrnMasterService, GrnMasterService>();
builder.Services.AddScoped<IGrnMasterRepository, GrnMasterRepository>();
builder.Services.AddScoped<IGrnDetailService, GrnDetailService>();
builder.Services.AddScoped<IGrnDetailRepository, GrnDetailRepository>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<ILocationRepository, LocationRepository>();
builder.Services.AddScoped<ISupplierService, SupplierService>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ISalesOrderService, SalesOrderService>();
builder.Services.AddScoped<ISalesOrderRepository, SalesOrderRepository>();
builder.Services.AddScoped<ISalesOrderDetailService, SalesOrderDetailService>();
builder.Services.AddScoped<ISalesOrderDetailRepository, SalesOrderDetailRepository>();
builder.Services.AddScoped<ISalesInvoiceService, SalesInvoiceService>();
builder.Services.AddScoped<ISalesInvoiceRepository, SalesInvoiceRepository>();
builder.Services.AddScoped<ISalesInvoiceDetailService, SalesInvoiceDetailService>();
builder.Services.AddScoped<ISalesInvoiceDetailRepository, SalesInvoiceDetailRepository>();
builder.Services.AddScoped<IPaymentModeService, PaymentModeService>();
builder.Services.AddScoped<IPaymentModeRepository, PaymentModeRepository>();
builder.Services.AddScoped<ISalesReceiptService, SalesReceiptService>();
builder.Services.AddScoped<ISalesReceiptRepository, SalesReceiptRepository>();
builder.Services.AddScoped<ISalesReceiptSalesInvoiceService, SalesReceiptSalesInvoiceService>();
builder.Services.AddScoped<ISalesReceiptSalesInvoiceRepository, SalesReceiptSalesInvoiceRepository>();
builder.Services.AddScoped<IUnitService, UnitService>();
builder.Services.AddScoped<IUnitRepository, UnitRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IItemMasterService, ItemMasterService>();
builder.Services.AddScoped<IItemMasterRepository, ItemMasterRepository>();
builder.Services.AddScoped<IBatchService, BatchService>();
builder.Services.AddScoped<IBatchRepository, BatchRepository>();
builder.Services.AddScoped<IItemBatchService, ItemBatchService>();
builder.Services.AddScoped<IItemBatchRepository, ItemBatchRepository>();
builder.Services.AddScoped<IBatchHasGrnMasterService, BatchHasGrnMasterService>();
builder.Services.AddScoped<IBatchHasGrnMasterRepository, BatchHasGrnMasterRepository>();
builder.Services.AddScoped<IItemBatchHasGrnDetailService, ItemBatchHasGrnDetailService>();
builder.Services.AddScoped<IItemBatchHasGrnDetailRepository, ItemBatchHasGrnDetailRepository>();
builder.Services.AddScoped<IItemTypeService, ItemTypeService>();
builder.Services.AddScoped<IItemTypeRepository, ItemTypeRepository>();
builder.Services.AddScoped<IRequisitionMasterService, RequisitionMasterService>();
builder.Services.AddScoped<IRequisitionMasterRepository, RequisitionMasterRepository>();
builder.Services.AddScoped<IRequisitionDetailService, RequisitionDetailService>();
builder.Services.AddScoped<IRequisitionDetailRepository, RequisitionDetailRepository>();
builder.Services.AddScoped<IChargesAndDeductionService, ChargesAndDeductionService>();
builder.Services.AddScoped<IChargesAndDeductionRepository, ChargesAndDeductionRepository>();
builder.Services.AddScoped<IChargesAndDeductionAppliedService, ChargesAndDeductionAppliedService>();
builder.Services.AddScoped<IChargesAndDeductionAppliedRepository, ChargesAndDeductionAppliedRepository>();
builder.Services.AddScoped<ITransactionTypeService, TransactionTypeService>();
builder.Services.AddScoped<ITransactionTypeRepository, TransactionTypeRepository>();
builder.Services.AddScoped<IIssueMasterService, IssueMasterService>();
builder.Services.AddScoped<IIssueMasterRepository, IssueMasterRepository>();
builder.Services.AddScoped<IIssueDetailService, IssueDetailService>();
builder.Services.AddScoped<IIssueDetailRepository, IssueDetailRepository>();
builder.Services.AddScoped<ICashierSessionService, CashierSessionService>();
builder.Services.AddScoped<ICashierSessionRepository, CashierSessionRepository>();
builder.Services.AddScoped<ICashierExpenseOutService, CashierExpenseOutService>();
builder.Services.AddScoped<ICashierExpenseOutRepository, CashierExpenseOutRepository>();
builder.Services.AddScoped<IUserLocationService, UserLocationService>();
builder.Services.AddScoped<IUserLocationRepository, UserLocationRepository>();
builder.Services.AddScoped<IExpenseOutRequisitionService, ExpenseOutRequisitionService>();
builder.Services.AddScoped<IExpenseOutRequisitionRepository, ExpenseOutRequisitionRepository>();
builder.Services.AddScoped<IBusinessTypeService, BusinessTypeService>();
builder.Services.AddScoped<IBusinessTypeRepository, BusinessTypeRepository>();
builder.Services.AddScoped<ICompanyTypeService, CompanyTypeService>();
builder.Services.AddScoped<ICompanyTypeRepository, CompanyTypeRepository>();
builder.Services.AddScoped<ISupplierCategoryService, SupplierCategoryService>();
builder.Services.AddScoped<ISupplierCategoryRepository, SupplierCategoryRepository>();
builder.Services.AddScoped<ISupplierAttachmentService, SupplierAttachmentService>();
builder.Services.AddScoped<ISupplierAttachmentRepository, SupplierAttachmentRepository>();
builder.Services.AddScoped<IMeasurementTypeService, MeasurementTypeService>();
builder.Services.AddScoped<IMeasurementTypeRepository, MeasurementTypeRepository>();
builder.Services.AddScoped<ILocationInventoryService, LocationInventoryService>();
builder.Services.AddScoped<ILocationInventoryRepository, LocationInventoryRepository>();
builder.Services.AddScoped<ILocationInventoryMovementService, LocationInventoryMovementService>();
builder.Services.AddScoped<ILocationInventoryMovementRepository, LocationInventoryMovementRepository>();
builder.Services.AddScoped<ILocationInventoryGoodsInTransitService, LocationInventoryGoodsInTransitService>();
builder.Services.AddScoped<ILocationInventoryGoodsInTransitRepository, LocationInventoryGoodsInTransitRepository>();
builder.Services.AddScoped<IDailyStockBalanceService, DailyStockBalanceService>();
builder.Services.AddScoped<IDailyStockBalanceRepository, DailyStockBalanceRepository>();
builder.Services.AddScoped<ILocationTypeService, LocationTypeService>();
builder.Services.AddScoped<ILocationTypeRepository, LocationTypeRepository>();
builder.Services.AddScoped<ISubItemMasterService, SubItemMasterService>();
builder.Services.AddScoped<ISubItemMasterRepository, SubItemMasterRepository>();
builder.Services.AddScoped<IDailyLocationInventoryService, DailyLocationInventoryService>();
builder.Services.AddScoped<IDailyLocationInventoryRepository, DailyLocationInventoryRepository>();
builder.Services.AddScoped<IDailyLocationInventoryLogService, DailyLocationInventoryLogService>();
builder.Services.AddScoped<IDailyLocationInventoryLogRepository, DailyLocationInventoryLogRepository>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDateOnlyTimeOnlyStringConverters();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// CORS middleware
app.UseCors("AllowSpecificOrigin");

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseForwardedHeaders();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<AuditMiddleware>();


app.MapControllers();

//app.Lifetime.ApplicationStarted.Register(() =>
//{
//    var consulClient = app.Services.GetRequiredService<IConsulClient>();
//    var registration = new AgentServiceRegistration()
//    {
//        ID = $"auth-service-api-{Guid.NewGuid()}",
//        Name = "auth-service-api",
//        Address = "localhost",
//        Port = 7273,
//        Check = new AgentServiceCheck()
//        {
//            HTTP = "https://localhost:7273/api/health/health",
//            Interval = TimeSpan.FromSeconds(30),
//            Timeout = TimeSpan.FromSeconds(5)
//        }
//    };
//    consulClient.Agent.ServiceRegister(registration).Wait();
//});

//app.Lifetime.ApplicationStopping.Register(() =>
//{
//    var consulClient = app.Services.GetRequiredService<IConsulClient>();
//    consulClient.Agent.ServiceDeregister("auth-service-api").Wait();
//});

app.Run();
