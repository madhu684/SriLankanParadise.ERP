using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ErpSystemContext : DbContext
{
    public ErpSystemContext()
    {
    }

    public ErpSystemContext(DbContextOptions<ErpSystemContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ActionLog> ActionLogs { get; set; }

    public virtual DbSet<ActionLog1> ActionLogs1 { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<AuditLog1> AuditLogs1 { get; set; }

    public virtual DbSet<Batch> Batches { get; set; }

    public virtual DbSet<BatchHasGrnMaster> BatchHasGrnMasters { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Channel> Channels { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<CompanySubscriptionModule> CompanySubscriptionModules { get; set; }

    public virtual DbSet<CompanySubscriptionModuleUser> CompanySubscriptionModuleUsers { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<GrnDetail> GrnDetails { get; set; }

    public virtual DbSet<GrnMaster> GrnMasters { get; set; }

    public virtual DbSet<ItemBatch> ItemBatches { get; set; }

    public virtual DbSet<ItemBatchHasGrnDetail> ItemBatchHasGrnDetails { get; set; }

    public virtual DbSet<ItemMaster> ItemMasters { get; set; }

    public virtual DbSet<Location> Locations { get; set; }

    public virtual DbSet<LocationChannel> LocationChannels { get; set; }

    public virtual DbSet<LocationChannelItemBatch> LocationChannelItemBatches { get; set; }

    public virtual DbSet<Module> Modules { get; set; }

    public virtual DbSet<PaymentMode> PaymentModes { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<PurchaseOrder> PurchaseOrders { get; set; }

    public virtual DbSet<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }

    public virtual DbSet<PurchaseRequisition> PurchaseRequisitions { get; set; }

    public virtual DbSet<PurchaseRequisitionDetail> PurchaseRequisitionDetails { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<SalesInvoice> SalesInvoices { get; set; }

    public virtual DbSet<SalesInvoiceDetail> SalesInvoiceDetails { get; set; }

    public virtual DbSet<SalesOrder> SalesOrders { get; set; }

    public virtual DbSet<SalesOrderDetail> SalesOrderDetails { get; set; }

    public virtual DbSet<SalesReceipt> SalesReceipts { get; set; }

    public virtual DbSet<SalesReceiptSalesInvoice> SalesReceiptSalesInvoices { get; set; }

    public virtual DbSet<SubModule> SubModules { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<SubscriptionModule> SubscriptionModules { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<Unit> Units { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserPermission> UserPermissions { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:LocalSqlServerConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ActionLog>(entity =>
        {
            entity.ToTable("ActionLog");

            entity.Property(e => e.Ipaddress)
                .HasMaxLength(50)
                .HasColumnName("IPAddress");
            entity.Property(e => e.Timestamp).HasColumnType("datetime");

            entity.HasOne(d => d.Action).WithMany(p => p.ActionLogs)
                .HasForeignKey(d => d.ActionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ActionLog_Permission");

            entity.HasOne(d => d.User).WithMany(p => p.ActionLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ActionLog_User");
        });

        modelBuilder.Entity<ActionLog1>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ActionLog$");

            entity.Property(e => e.Ipaddress).HasColumnName("IPAddress");
            entity.Property(e => e.Timestamp).HasColumnType("datetime");
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("AuditLog");

            entity.Property(e => e.AccessedMethod).HasMaxLength(50);
            entity.Property(e => e.AccessedPath).HasMaxLength(200);
            entity.Property(e => e.Ipaddress)
                .HasMaxLength(50)
                .HasColumnName("IPAddress");
            entity.Property(e => e.Timestamp).HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.AuditLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AuditLog_AuditLog");
        });

        modelBuilder.Entity<AuditLog1>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("AuditLog$");

            entity.Property(e => e.Ipaddress).HasColumnName("IPAddress");
            entity.Property(e => e.Timestamp).HasColumnType("datetime");
        });

        modelBuilder.Entity<Batch>(entity =>
        {
            entity.HasKey(e => e.BatchId).HasName("PK__Batch__5D55CE58823461F4");

            entity.ToTable("Batch");

            entity.Property(e => e.BatchRef).HasMaxLength(50);
            entity.Property(e => e.Date).HasColumnType("date");
        });

        modelBuilder.Entity<BatchHasGrnMaster>(entity =>
        {
            entity.ToTable("BatchHasGrnMaster");

            entity.HasOne(d => d.Batch).WithMany(p => p.BatchHasGrnMasters)
                .HasForeignKey(d => d.BatchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BatchHasG__Batch__6EC0713C");

            entity.HasOne(d => d.GrnMaster).WithMany(p => p.BatchHasGrnMasters)
                .HasForeignKey(d => d.GrnMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BatchHasG__GrnMa__6FB49575");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A0BE9D77BA0");

            entity.ToTable("Category");

            entity.Property(e => e.CategoryName).HasMaxLength(50);
        });

        modelBuilder.Entity<Channel>(entity =>
        {
            entity.HasKey(e => e.ChannelId).HasName("PK__Channel__38C3E814A4DDAF2D");

            entity.ToTable("Channel");

            entity.Property(e => e.ChannelName).HasMaxLength(50);
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.ToTable("Company");

            entity.Property(e => e.CompanyName).HasMaxLength(50);
            entity.Property(e => e.SubscriptionExpiredDate).HasColumnType("datetime");

            entity.HasOne(d => d.SubscriptionPlan).WithMany(p => p.Companies)
                .HasForeignKey(d => d.SubscriptionPlanId)
                .HasConstraintName("FK_Company_Subscription");
        });

        modelBuilder.Entity<CompanySubscriptionModule>(entity =>
        {
            entity.ToTable("CompanySubscriptionModule");

            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Company).WithMany(p => p.CompanySubscriptionModules)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CompanySubscriptionModule_Company");

            entity.HasOne(d => d.SubscriptionModule).WithMany(p => p.CompanySubscriptionModules)
                .HasForeignKey(d => d.SubscriptionModuleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CompanySubscriptionModule_SubscriptionModule");
        });

        modelBuilder.Entity<CompanySubscriptionModuleUser>(entity =>
        {
            entity.HasKey(e => e.CompanySubscriptionModuleIdUserId);

            entity.ToTable("CompanySubscriptionModuleUser");

            entity.HasOne(d => d.CompanySubscriptionModule).WithMany(p => p.CompanySubscriptionModuleUsers)
                .HasForeignKey(d => d.CompanySubscriptionModuleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CompanySubscriptionModuleUser_Module");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64D8B489EACD");

            entity.ToTable("Customer");

            entity.Property(e => e.ContactPerson).HasMaxLength(50);
            entity.Property(e => e.CustomerName).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(12);

            entity.HasOne(d => d.Company).WithMany(p => p.Customers)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Customer_Company");
        });

        modelBuilder.Entity<GrnDetail>(entity =>
        {
            entity.HasKey(e => e.GrnDetailId).HasName("PK__GrnDetai__FA976E17A38630E5");

            entity.ToTable("GrnDetail");

            entity.Property(e => e.ItemId).HasMaxLength(50);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.GrnMaster).WithMany(p => p.GrnDetails)
                .HasForeignKey(d => d.GrnMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__GrnDetail__GrnMa__01D345B0");
        });

        modelBuilder.Entity<GrnMaster>(entity =>
        {
            entity.HasKey(e => e.GrnMasterId).HasName("PK__GrnMaste__2A763230BEE7D0ED");

            entity.ToTable("GrnMaster");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedDate).HasColumnType("date");
            entity.Property(e => e.GrnDate).HasColumnType("date");
            entity.Property(e => e.ReceivedBy).HasMaxLength(50);
            entity.Property(e => e.ReceivedDate).HasColumnType("date");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.PurchaseOrder).WithMany(p => p.GrnMasters)
                .HasForeignKey(d => d.PurchaseOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GrnMaster_PurchaseOrder");
        });

        modelBuilder.Entity<ItemBatch>(entity =>
        {
            entity.HasKey(e => new { e.BatchId, e.ItemMasterId }).HasName("PK__ItemBatc__9B3B15491EE582C2");

            entity.ToTable("ItemBatch");

            entity.Property(e => e.CostPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.SellingPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Batch).WithMany(p => p.ItemBatches)
                .HasForeignKey(d => d.BatchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemBatch__Batch__7755B73D");

            entity.HasOne(d => d.ItemMaster).WithMany(p => p.ItemBatches)
                .HasForeignKey(d => d.ItemMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemBatch__ItemM__76619304");
        });

        modelBuilder.Entity<ItemBatchHasGrnDetail>(entity =>
        {
            entity.HasKey(e => e.ItemBatchHasGrnDetailId).HasName("PK_ItemBatchHasGrnDetailId");

            entity.ToTable("ItemBatchHasGrnDetail");

            entity.HasOne(d => d.GrnDetail).WithMany(p => p.ItemBatchHasGrnDetails)
                .HasForeignKey(d => d.GrnDetailId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemBatch__GrnDe__05A3D694");

            entity.HasOne(d => d.ItemBatch).WithMany(p => p.ItemBatchHasGrnDetails)
                .HasForeignKey(d => new { d.ItemBatchBatchId, d.ItemBatchItemMasterId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemBatchHasGrnD__04AFB25B");
        });

        modelBuilder.Entity<ItemMaster>(entity =>
        {
            entity.HasKey(e => e.ItemMasterId).HasName("PK__ItemMast__66EDB11DB74F45EE");

            entity.ToTable("ItemMaster");

            entity.Property(e => e.CostPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.ItemName).HasMaxLength(50);
            entity.Property(e => e.SellingPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Category).WithMany(p => p.ItemMasters)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemMaste__Categ__72910220");

            entity.HasOne(d => d.Unit).WithMany(p => p.ItemMasters)
                .HasForeignKey(d => d.UnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemMaste__UnitI__73852659");
        });

        modelBuilder.Entity<Location>(entity =>
        {
            entity.HasKey(e => e.LocationId).HasName("PK__Location__E7FEA4977CC34C1F");

            entity.ToTable("Location");

            entity.Property(e => e.LocationName).HasMaxLength(50);

            entity.HasOne(d => d.Company).WithMany(p => p.Locations)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Location__Compan__69C6B1F5");
        });

        modelBuilder.Entity<LocationChannel>(entity =>
        {
            entity.HasKey(e => e.LocationChannelId).HasName("PK__Location__56BC025DE25663F8");

            entity.ToTable("LocationChannel");

            entity.HasOne(d => d.Channel).WithMany(p => p.LocationChannels)
                .HasForeignKey(d => d.ChannelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LocationC__Chann__6CA31EA0");

            entity.HasOne(d => d.Location).WithMany(p => p.LocationChannels)
                .HasForeignKey(d => d.LocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LocationC__Locat__6D9742D9");
        });

        modelBuilder.Entity<LocationChannelItemBatch>(entity =>
        {
            entity.HasKey(e => e.LocationChannelItemBatchId).HasName("PK__Location__84C1F4051DFD2387");

            entity.ToTable("LocationChannelItemBatch");

            entity.HasOne(d => d.LocationChannel).WithMany(p => p.LocationChannelItemBatches)
                .HasForeignKey(d => d.LocationChannelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LocationC__Locat__7CD98669");

            entity.HasOne(d => d.ItemBatch).WithMany(p => p.LocationChannelItemBatches)
                .HasForeignKey(d => new { d.ItemBatchBatchId, d.ItemBatchItemMasterId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__LocationChannelI__7BE56230");
        });

        modelBuilder.Entity<Module>(entity =>
        {
            entity.ToTable("Module");

            entity.Property(e => e.ModuleName).HasMaxLength(50);
        });

        modelBuilder.Entity<PaymentMode>(entity =>
        {
            entity.HasKey(e => e.PaymentModeId).HasName("PK__PaymentM__F9599549A3B51321");

            entity.ToTable("PaymentMode");

            entity.Property(e => e.Mode).HasMaxLength(50);
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.ToTable("Permission");

            entity.Property(e => e.PermissionName).HasMaxLength(100);

            entity.HasOne(d => d.Module).WithMany(p => p.Permissions)
                .HasForeignKey(d => d.ModuleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Permission_Module");
        });

        modelBuilder.Entity<PurchaseOrder>(entity =>
        {
            entity.HasKey(e => e.PurchaseOrderId).HasName("PK__Purchase__036BACA43F94A961");

            entity.ToTable("PurchaseOrder");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedDate).HasColumnType("date");
            entity.Property(e => e.DeliveryDate).HasColumnType("date");
            entity.Property(e => e.OrderDate).HasColumnType("date");
            entity.Property(e => e.OrderedBy).HasMaxLength(50);
            entity.Property(e => e.ReferenceNo)
                .HasMaxLength(20)
                .HasDefaultValueSql("('PO'+CONVERT([nvarchar](20),NEXT VALUE FOR [dbo].[PurchaseOrderReferenceNoSeq]))");
            entity.Property(e => e.Remark).HasMaxLength(50);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Supplier).WithMany(p => p.PurchaseOrders)
                .HasForeignKey(d => d.SupplierId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PurchaseO__Suppl__0F2D40CE");
        });

        modelBuilder.Entity<PurchaseOrderDetail>(entity =>
        {
            entity.HasKey(e => e.PurchaseOrderDetailId).HasName("PK__Purchase__5026B69851E7F02E");

            entity.ToTable("PurchaseOrderDetail");

            entity.Property(e => e.ItemCategory).HasMaxLength(50);
            entity.Property(e => e.ItemId).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.PurchaseOrder).WithMany(p => p.PurchaseOrderDetails)
                .HasForeignKey(d => d.PurchaseOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PurchaseO__Purch__12FDD1B2");
        });

        modelBuilder.Entity<PurchaseRequisition>(entity =>
        {
            entity.HasKey(e => e.PurchaseRequisitionId).HasName("PK__Purchase__AA9CA83912D661FD");

            entity.ToTable("PurchaseRequisition");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedDate).HasColumnType("date");
            entity.Property(e => e.ContactNo).HasMaxLength(12);
            entity.Property(e => e.DeliveryDate).HasColumnType("date");
            entity.Property(e => e.Department).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.PurposeOfRequest).HasMaxLength(250);
            entity.Property(e => e.ReferenceNo).HasMaxLength(50);
            entity.Property(e => e.RequestedBy).HasMaxLength(50);
            entity.Property(e => e.RequisitionDate).HasColumnType("date");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.DeliveryLocationNavigation).WithMany(p => p.PurchaseRequisitions)
                .HasForeignKey(d => d.DeliveryLocation)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseRequisition_Location");
        });

        modelBuilder.Entity<PurchaseRequisitionDetail>(entity =>
        {
            entity.HasKey(e => e.PurchaseRequisitionDetailId).HasName("PK__Purchase__D408F53003978D24");

            entity.ToTable("PurchaseRequisitionDetail");

            entity.Property(e => e.ItemCategory).HasMaxLength(50);
            entity.Property(e => e.ItemId).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.PurchaseRequisition).WithMany(p => p.PurchaseRequisitionDetails)
                .HasForeignKey(d => d.PurchaseRequisitionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PurchaseR__Purch__0C50D423");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Role");

            entity.Property(e => e.RoleName).HasMaxLength(200);

            entity.HasOne(d => d.Module).WithMany(p => p.Roles)
                .HasForeignKey(d => d.ModuleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Role_Module");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.ToTable("RolePermission");

            entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RolePermission_Permission");

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RolePermission_Role");
        });

        modelBuilder.Entity<SalesInvoice>(entity =>
        {
            entity.HasKey(e => e.SalesInvoiceId).HasName("PK__SalesInv__BA05CD1AAE015F4B");

            entity.ToTable("SalesInvoice");

            entity.Property(e => e.AmountDue).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedDate).HasColumnType("date");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.DueDate).HasColumnType("date");
            entity.Property(e => e.InvoiceDate).HasColumnType("date");
            entity.Property(e => e.ReferenceNo)
                .HasMaxLength(20)
                .HasDefaultValueSql("('SI'+CONVERT([nvarchar](20),NEXT VALUE FOR [dbo].[SalesInvoiceReferenceNoSeq]))");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<SalesInvoiceDetail>(entity =>
        {
            entity.HasKey(e => e.SalesInvoiceDetailId).HasName("PK__SalesInv__9263454C38440D57");

            entity.ToTable("SalesInvoiceDetail");

            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.SalesInvoice).WithMany(p => p.SalesInvoiceDetails)
                .HasForeignKey(d => d.SalesInvoiceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SalesInvo__Sales__19AACF41");
        });

        modelBuilder.Entity<SalesOrder>(entity =>
        {
            entity.HasKey(e => e.SalesOrderId).HasName("PK__SalesOrd__B14003E2AF3CC5EF");

            entity.ToTable("SalesOrder");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedDate).HasColumnType("date");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.DeliveryDate).HasColumnType("date");
            entity.Property(e => e.OrderDate).HasColumnType("date");
            entity.Property(e => e.ReferenceNo)
                .HasMaxLength(20)
                .HasDefaultValueSql("('SO'+CONVERT([nvarchar](20),NEXT VALUE FOR [dbo].[SalesOrderReferenceNoSeq]))");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Customer).WithMany(p => p.SalesOrders)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__SalesOrde__Custo__1F63A897");
        });

        modelBuilder.Entity<SalesOrderDetail>(entity =>
        {
            entity.HasKey(e => e.SalesOrderDetailId).HasName("PK__SalesOrd__6B9B51257653B189");

            entity.ToTable("SalesOrderDetail");

            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.SalesOrder).WithMany(p => p.SalesOrderDetails)
                .HasForeignKey(d => d.SalesOrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SalesOrde__Sales__22401542");

            entity.HasOne(d => d.ItemBatch).WithMany(p => p.SalesOrderDetails)
                .HasForeignKey(d => new { d.ItemBatchBatchId, d.ItemBatchItemMasterId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SalesOrderDetail__2334397B");
        });

        modelBuilder.Entity<SalesReceipt>(entity =>
        {
            entity.HasKey(e => e.SalesReceiptId).HasName("PK__SalesRec__E8B6A6227DF9265F");

            entity.ToTable("SalesReceipt");

            entity.Property(e => e.AmountReceived).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.ReceiptDate).HasColumnType("date");
            entity.Property(e => e.ReferenceNo).HasMaxLength(20);

            entity.HasOne(d => d.PaymentMode).WithMany(p => p.SalesReceipts)
                .HasForeignKey(d => d.PaymentModeId)
                .HasConstraintName("FK_SalesReceipt_PaymentMode");
        });

        modelBuilder.Entity<SalesReceiptSalesInvoice>(entity =>
        {
            entity.HasKey(e => e.SalesReceiptSalesInvoiceId).HasName("PK__SalesRec__BCB7101771C12306");

            entity.ToTable("SalesReceiptSalesInvoice");

            entity.Property(e => e.SettledAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.SalesInvoice).WithMany(p => p.SalesReceiptSalesInvoices)
                .HasForeignKey(d => d.SalesInvoiceId)
                .HasConstraintName("FK_SalesReceiptSalesInvoice_SalesInvoice");

            entity.HasOne(d => d.SalesReceipt).WithMany(p => p.SalesReceiptSalesInvoices)
                .HasForeignKey(d => d.SalesReceiptId)
                .HasConstraintName("FK_SalesReceiptSalesInvoice_SalesReceipt");
        });

        modelBuilder.Entity<SubModule>(entity =>
        {
            entity.ToTable("SubModule");

            entity.Property(e => e.SubModuleName).HasMaxLength(50);

            entity.HasOne(d => d.Module).WithMany(p => p.SubModules)
                .HasForeignKey(d => d.ModuleId)
                .HasConstraintName("FK_SubModule_Module");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.ToTable("Subscription");

            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.PlanName).HasMaxLength(50);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<SubscriptionModule>(entity =>
        {
            entity.ToTable("SubscriptionModule");

            entity.Property(e => e.ModulePricePerPlan).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Module).WithMany(p => p.SubscriptionModules)
                .HasForeignKey(d => d.ModuleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SubscriptionModule_Module");

            entity.HasOne(d => d.Subscription).WithMany(p => p.SubscriptionModules)
                .HasForeignKey(d => d.SubscriptionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SubscriptionModule_Subscription");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.SupplierId).HasName("PK__Supplier__4BE666B4F4B0E6B1");

            entity.ToTable("Supplier");

            entity.Property(e => e.ContactPerson).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(12);
            entity.Property(e => e.SupplierName).HasMaxLength(50);

            entity.HasOne(d => d.Company).WithMany(p => p.Suppliers)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Supplier_Company");
        });

        modelBuilder.Entity<Unit>(entity =>
        {
            entity.HasKey(e => e.UnitId).HasName("PK__Unit__44F5ECB57EA68CDD");

            entity.ToTable("Unit");

            entity.Property(e => e.UnitName).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");

            entity.Property(e => e.ContactNo).HasMaxLength(12);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Firstname).HasMaxLength(50);
            entity.Property(e => e.Lastname).HasMaxLength(50);
            entity.Property(e => e.PasswordHash).HasMaxLength(500);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .UseCollation("SQL_Latin1_General_CP1_CS_AS");

            entity.HasOne(d => d.Company).WithMany(p => p.Users)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_User_Company");
        });

        modelBuilder.Entity<UserPermission>(entity =>
        {
            entity.ToTable("UserPermission");

            entity.HasOne(d => d.Permission).WithMany(p => p.UserPermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserPermission_Permission");

            entity.HasOne(d => d.User).WithMany(p => p.UserPermissions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserPermission_User");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.ToTable("UserRole");

            entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserRole_Role");

            entity.HasOne(d => d.User).WithMany(p => p.UserRoles)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserRole_User");
        });
        modelBuilder.HasSequence("PurchaseOrderReferenceNoSeq").StartsAt(1000L);
        modelBuilder.HasSequence("SalesInvoiceReferenceNoSeq").StartsAt(1000L);
        modelBuilder.HasSequence("SalesOrderReferenceNoSeq").StartsAt(1000L);

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
