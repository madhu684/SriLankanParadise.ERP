using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SriLankanParadise.ERP.UserManagement.DataModels;

public partial class ErpSystemNewContext : DbContext
{
    public ErpSystemNewContext()
    {
    }

    public ErpSystemNewContext(DbContextOptions<ErpSystemNewContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ActionLog> ActionLogs { get; set; }

    public virtual DbSet<ActionLog1> ActionLogs1 { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<AuditLog1> AuditLogs1 { get; set; }

    public virtual DbSet<Batch> Batches { get; set; }

    public virtual DbSet<BatchHasGrnMaster> BatchHasGrnMasters { get; set; }

    public virtual DbSet<BusinessType> BusinessTypes { get; set; }

    public virtual DbSet<CashierExpenseOut> CashierExpenseOuts { get; set; }

    public virtual DbSet<CashierSession> CashierSessions { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<ChargesAndDeduction> ChargesAndDeductions { get; set; }

    public virtual DbSet<ChargesAndDeductionApplied> ChargesAndDeductionApplieds { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<CompanySubscriptionModule> CompanySubscriptionModules { get; set; }

    public virtual DbSet<CompanySubscriptionModuleUser> CompanySubscriptionModuleUsers { get; set; }

    public virtual DbSet<CompanyType> CompanyTypes { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<DailyStockBalance> DailyStockBalances { get; set; }

    public virtual DbSet<ExpenseOutRequisition> ExpenseOutRequisitions { get; set; }

    public virtual DbSet<GrnDetail> GrnDetails { get; set; }

    public virtual DbSet<GrnMaster> GrnMasters { get; set; }

    public virtual DbSet<IssueDetail> IssueDetails { get; set; }

    public virtual DbSet<IssueMaster> IssueMasters { get; set; }

    public virtual DbSet<ItemBatch> ItemBatches { get; set; }

    public virtual DbSet<ItemBatchHasGrnDetail> ItemBatchHasGrnDetails { get; set; }

    public virtual DbSet<ItemMaster> ItemMasters { get; set; }

    public virtual DbSet<ItemType> ItemTypes { get; set; }

    public virtual DbSet<Location> Locations { get; set; }

    public virtual DbSet<LocationInventory> LocationInventories { get; set; }

    public virtual DbSet<LocationInventoryGoodsInTransit> LocationInventoryGoodsInTransits { get; set; }

    public virtual DbSet<LocationInventoryMovement> LocationInventoryMovements { get; set; }

    public virtual DbSet<LocationType> LocationTypes { get; set; }

    public virtual DbSet<MeasurementType> MeasurementTypes { get; set; }

    public virtual DbSet<Module> Modules { get; set; }

    public virtual DbSet<MovementType> MovementTypes { get; set; }

    public virtual DbSet<PaymentMode> PaymentModes { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<PurchaseOrder> PurchaseOrders { get; set; }

    public virtual DbSet<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }

    public virtual DbSet<PurchaseRequisition> PurchaseRequisitions { get; set; }

    public virtual DbSet<PurchaseRequisitionDetail> PurchaseRequisitionDetails { get; set; }

    public virtual DbSet<RequisitionDetail> RequisitionDetails { get; set; }

    public virtual DbSet<RequisitionMaster> RequisitionMasters { get; set; }

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

    public virtual DbSet<SupplierAttachment> SupplierAttachments { get; set; }

    public virtual DbSet<SupplierCategory> SupplierCategories { get; set; }

    public virtual DbSet<TransactionType> TransactionTypes { get; set; }

    public virtual DbSet<Unit> Units { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserLocation> UserLocations { get; set; }

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

        modelBuilder.Entity<BusinessType>(entity =>
        {
            entity.HasKey(e => e.BusinessTypeId).HasName("PK__Business__1D43DEC05AC0EEF6");

            entity.ToTable("BusinessType");

            entity.Property(e => e.TypeName).HasMaxLength(100);
        });

        modelBuilder.Entity<CashierExpenseOut>(entity =>
        {
            entity.HasKey(e => e.CashierExpenseOutId).HasName("PK__CashierE__F3B5AFBCD6C6368D");

            entity.ToTable("CashierExpenseOut");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);

            entity.HasOne(d => d.ExpenseOutRequisition).WithMany(p => p.CashierExpenseOuts)
                .HasForeignKey(d => d.ExpenseOutRequisitionId)
                .HasConstraintName("FK_CashierExpenseOut_ExpenseOutRequisition");

            entity.HasOne(d => d.User).WithMany(p => p.CashierExpenseOuts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_CashierExpenseOut_User");
        });

        modelBuilder.Entity<CashierSession>(entity =>
        {
            entity.HasKey(e => e.CashierSessionId).HasName("PK__CashierS__A430047D465B9DC9");

            entity.ToTable("CashierSession");

            entity.Property(e => e.ActualCashInHand).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ActualChequesInHand).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OpeningBalance).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ReasonCashInHandDifference).HasMaxLength(255);
            entity.Property(e => e.ReasonChequesInHandDifference).HasMaxLength(255);
            entity.Property(e => e.SessionIn).HasColumnType("datetime");
            entity.Property(e => e.SessionOut).HasColumnType("datetime");

            entity.HasOne(d => d.User).WithMany(p => p.CashierSessions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_CashierSession_User");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A0BE9D77BA0");

            entity.ToTable("Category");

            entity.Property(e => e.CategoryName).HasMaxLength(50);
        });

        modelBuilder.Entity<ChargesAndDeduction>(entity =>
        {
            entity.HasKey(e => e.ChargesAndDeductionId).HasName("PK__ChargesA__7729DC0F45CAE69E");

            entity.ToTable("ChargesAndDeduction");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedBy).HasMaxLength(255);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DateApplied).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.DisplayName).HasMaxLength(255);
            entity.Property(e => e.IsApplicableForLineItem).HasDefaultValueSql("((0))");
            entity.Property(e => e.ModifiedBy).HasMaxLength(255);
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.Percentage).HasColumnType("decimal(5, 2)");
            entity.Property(e => e.Sign)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
        });

        modelBuilder.Entity<ChargesAndDeductionApplied>(entity =>
        {
            entity.HasKey(e => e.ChargesAndDeductionAppliedId).HasName("PK__ChargesA__6A81FED8A77BD555");

            entity.ToTable("ChargesAndDeductionApplied");

            entity.Property(e => e.AppliedValue).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedBy).HasMaxLength(255);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DateApplied).HasColumnType("datetime");
            entity.Property(e => e.ModifiedBy).HasMaxLength(255);
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");

            entity.HasOne(d => d.ChargesAndDeduction).WithMany(p => p.ChargesAndDeductionApplieds)
                .HasForeignKey(d => d.ChargesAndDeductionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ChargesAndDeduction_ChargesAndDeductionApplied");

            entity.HasOne(d => d.TransactionType).WithMany(p => p.ChargesAndDeductionApplieds)
                .HasForeignKey(d => d.TransactionTypeId)
                .HasConstraintName("FK_TransactionType_ChargesAndDeductionApplied");
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.ToTable("Company");

            entity.Property(e => e.BatchStockType)
                .HasMaxLength(50)
                .IsUnicode(false);
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
                .HasConstraintName("FK_CompanySubscriptionModuleUser_CompanySubscriptionModule");
        });

        modelBuilder.Entity<CompanyType>(entity =>
        {
            entity.HasKey(e => e.CompanyTypeId).HasName("PK__CompanyT__060198D8DDBF81FD");

            entity.ToTable("CompanyType");

            entity.Property(e => e.TypeName).HasMaxLength(100);
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

        modelBuilder.Entity<DailyStockBalance>(entity =>
        {
            entity.HasKey(e => e.DailyStockBalanceId).HasName("PK__DailySto__3A2A0CB7BC9199E9");

            entity.ToTable("DailyStockBalance");

            entity.Property(e => e.Date).HasColumnType("datetime");

            entity.HasOne(d => d.Location).WithMany(p => p.DailyStockBalances)
                .HasForeignKey(d => d.LocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DailyStockBalance_Location");

            entity.HasOne(d => d.ItemBatch).WithMany(p => p.DailyStockBalances)
                .HasForeignKey(d => new { d.BatchId, d.ItemMasterId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DailyStockBalance_ItemMaster_Batch");
        });

        modelBuilder.Entity<ExpenseOutRequisition>(entity =>
        {
            entity.HasKey(e => e.ExpenseOutRequisitionId).HasName("PK__ExpenseO__A207C4EAC69BB0C3");

            entity.ToTable("ExpenseOutRequisition");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ApprovedBy).HasMaxLength(255);
            entity.Property(e => e.ApprovedDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.Reason).HasMaxLength(255);
            entity.Property(e => e.RecommendedBy).HasMaxLength(255);
            entity.Property(e => e.RecommendedDate).HasColumnType("datetime");
            entity.Property(e => e.ReferenceNumber).HasMaxLength(255);
            entity.Property(e => e.RequestedBy).HasMaxLength(255);
        });

        modelBuilder.Entity<GrnDetail>(entity =>
        {
            entity.HasKey(e => e.GrnDetailId).HasName("PK__GrnDetai__FA976E17A38630E5");

            entity.ToTable("GrnDetail");

            entity.Property(e => e.ExpiryDate).HasColumnType("date");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.GrnMaster).WithMany(p => p.GrnDetails)
                .HasForeignKey(d => d.GrnMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__GrnDetail__GrnMa__01D345B0");

            entity.HasOne(d => d.Item).WithMany(p => p.GrnDetails)
                .HasForeignKey(d => d.ItemId)
                .HasConstraintName("FK_GrnDetail_ItemMaster");
        });

        modelBuilder.Entity<GrnMaster>(entity =>
        {
            entity.HasKey(e => e.GrnMasterId).HasName("PK__GrnMaste__2A763230BEE7D0ED");

            entity.ToTable("GrnMaster");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.GrnDate).HasColumnType("date");
            entity.Property(e => e.GrnType).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.ReceivedBy).HasMaxLength(50);
            entity.Property(e => e.ReceivedDate).HasColumnType("date");

            entity.HasOne(d => d.PurchaseOrder).WithMany(p => p.GrnMasters)
                .HasForeignKey(d => d.PurchaseOrderId)
                .HasConstraintName("FK_GrnMaster_PurchaseOrder");

            entity.HasOne(d => d.WarehouseLocation).WithMany(p => p.GrnMasters)
                .HasForeignKey(d => d.WarehouseLocationId)
                .HasConstraintName("FK_GrnMaster_WarehouseLocationId");
        });

        modelBuilder.Entity<IssueDetail>(entity =>
        {
            entity.HasKey(e => e.IssueDetailId).HasName("PK__IssueDet__68ADB55EDD3D28C2");

            entity.ToTable("IssueDetail");

            entity.Property(e => e.Quantity).HasColumnType("decimal(18, 8)");

            entity.HasOne(d => d.Batch).WithMany(p => p.IssueDetails)
                .HasForeignKey(d => d.BatchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Batch_IssueDetail");

            entity.HasOne(d => d.IssueMaster).WithMany(p => p.IssueDetails)
                .HasForeignKey(d => d.IssueMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_IssueMaster_IssueDetail");

            entity.HasOne(d => d.ItemMaster).WithMany(p => p.IssueDetails)
                .HasForeignKey(d => d.ItemMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ItemMaster_IssueDetail");
        });

        modelBuilder.Entity<IssueMaster>(entity =>
        {
            entity.HasKey(e => e.IssueMasterId).HasName("PK__IssueMas__69BF2ABEF251488C");

            entity.ToTable("IssueMaster");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.IssueDate).HasColumnType("datetime");
            entity.Property(e => e.IssueType).HasMaxLength(50);
            entity.Property(e => e.ReferenceNumber).HasMaxLength(255);

            entity.HasOne(d => d.RequisitionMaster).WithMany(p => p.IssueMasters)
                .HasForeignKey(d => d.RequisitionMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RequisitionMaster_IssueMaster");
        });

        modelBuilder.Entity<ItemBatch>(entity =>
        {
            entity.HasKey(e => new { e.BatchId, e.ItemMasterId }).HasName("PK__ItemBatc__9B3B15491EE582C2");

            entity.ToTable("ItemBatch");

            entity.Property(e => e.CostPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.ExpiryDate).HasColumnType("date");
            entity.Property(e => e.SellingPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Batch).WithMany(p => p.ItemBatches)
                .HasForeignKey(d => d.BatchId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemBatch__Batch__7755B73D");

            entity.HasOne(d => d.ItemMaster).WithMany(p => p.ItemBatches)
                .HasForeignKey(d => d.ItemMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemBatch__ItemM__76619304");

            entity.HasOne(d => d.Location).WithMany(p => p.ItemBatches)
                .HasForeignKey(d => d.LocationId)
                .HasConstraintName("FK_Location_ItemBatch");
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

            entity.Property(e => e.ConversionRate).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.ItemCode).HasMaxLength(50);
            entity.Property(e => e.ItemName).HasMaxLength(50);

            entity.HasOne(d => d.Category).WithMany(p => p.ItemMasters)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemMaste__Categ__72910220");

            entity.HasOne(d => d.InventoryUnit).WithMany(p => p.ItemMasterInventoryUnits)
                .HasForeignKey(d => d.InventoryUnitId)
                .HasConstraintName("FK_ItemMaster_InventoryUnitId");

            entity.HasOne(d => d.ItemType).WithMany(p => p.ItemMasters)
                .HasForeignKey(d => d.ItemTypeId)
                .HasConstraintName("FK_ItemType_ItemMaster");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK_ItemMaster_ParentId");

            entity.HasOne(d => d.Unit).WithMany(p => p.ItemMasterUnits)
                .HasForeignKey(d => d.UnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ItemMaste__UnitI__73852659");
        });

        modelBuilder.Entity<ItemType>(entity =>
        {
            entity.HasKey(e => e.ItemTypeId).HasName("PK__ItemType__F51540FB7D4467A1");

            entity.ToTable("ItemType");

            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
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

            entity.HasOne(d => d.LocationType).WithMany(p => p.Locations)
                .HasForeignKey(d => d.LocationTypeId)
                .HasConstraintName("FK_LocationType_Location");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK_Parent_Location");
        });

        modelBuilder.Entity<LocationInventory>(entity =>
        {
            entity.HasKey(e => e.LocationInventoryId).HasName("PK__Location__9ACB0EFF6A563B77");

            entity.ToTable("LocationInventory");

            entity.Property(e => e.BatchNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.StockInHand).HasColumnType("decimal(18, 8)");

            entity.HasOne(d => d.ItemMaster).WithMany(p => p.LocationInventories)
                .HasForeignKey(d => d.ItemMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LocationInventory_Itemmaster");

            entity.HasOne(d => d.Location).WithMany(p => p.LocationInventories)
                .HasForeignKey(d => d.LocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LocationInventory_Location");
        });

        modelBuilder.Entity<LocationInventoryGoodsInTransit>(entity =>
        {
            entity.HasKey(e => e.LocationInventoryGoodsInTransitId).HasName("PK__Location__CB0D5797E531BA90");

            entity.ToTable("LocationInventoryGoodsInTransit");

            entity.Property(e => e.Date).HasColumnType("date");

            entity.HasOne(d => d.FromLocation).WithMany(p => p.LocationInventoryGoodsInTransitFromLocations)
                .HasForeignKey(d => d.FromLocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LocationInventoryGoodsInTransit_FromLocation");

            entity.HasOne(d => d.ToLocation).WithMany(p => p.LocationInventoryGoodsInTransitToLocations)
                .HasForeignKey(d => d.ToLocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LocationInventoryGoodsInTransit_ToLocation");

            entity.HasOne(d => d.ItemBatch).WithMany(p => p.LocationInventoryGoodsInTransits)
                .HasForeignKey(d => new { d.BatchId, d.ItemMasterId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LocationInventoryGoodsInTransit_ItemMaster_Batch");
        });

        modelBuilder.Entity<LocationInventoryMovement>(entity =>
        {
            entity.HasKey(e => e.LocationInventoryMovementId).HasName("PK__Location__A274056769EF63C5");

            entity.ToTable("LocationInventoryMovement");

            entity.Property(e => e.BatchNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.Qty).HasColumnType("decimal(18, 8)");

            entity.HasOne(d => d.Location).WithMany(p => p.LocationInventoryMovements)
                .HasForeignKey(d => d.LocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LocationInventoryMovement_Location");

            entity.HasOne(d => d.MovementType).WithMany(p => p.LocationInventoryMovements)
                .HasForeignKey(d => d.MovementTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LocationInventoryMovement_MovementType");

            entity.HasOne(d => d.TransactionType).WithMany(p => p.LocationInventoryMovements)
                .HasForeignKey(d => d.TransactionTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LocationInventoryMovement_TransactionType");
        });

        modelBuilder.Entity<LocationType>(entity =>
        {
            entity.HasKey(e => e.LocationTypeId).HasName("PK__Location__737D32F95DE8DC0C");

            entity.ToTable("LocationType");

            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<MeasurementType>(entity =>
        {
            entity.HasKey(e => e.MeasurementTypeId).HasName("PK__Measurem__167933E78448B79A");

            entity.ToTable("MeasurementType");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Module>(entity =>
        {
            entity.ToTable("Module");

            entity.Property(e => e.ModuleName).HasMaxLength(50);
        });

        modelBuilder.Entity<MovementType>(entity =>
        {
            entity.HasKey(e => e.MovementTypeId).HasName("PK__Movement__74FB1F11EC2FC108");

            entity.ToTable("MovementType");

            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(50);
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
            entity.Property(e => e.ApprovedDate).HasColumnType("datetime");
            entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
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

            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.ItemMaster).WithMany(p => p.PurchaseOrderDetails)
                .HasForeignKey(d => d.ItemMasterId)
                .HasConstraintName("FK_PurchaseOrderDetail_ItemMaster");

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
            entity.Property(e => e.ApprovedDate).HasColumnType("datetime");
            entity.Property(e => e.ContactNo).HasMaxLength(12);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.ExpectedDeliveryDate).HasColumnType("date");
            entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.PurposeOfRequest).HasMaxLength(250);
            entity.Property(e => e.ReferenceNo).HasMaxLength(50);
            entity.Property(e => e.RequestedBy).HasMaxLength(50);
            entity.Property(e => e.RequisitionDate).HasColumnType("date");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.DepartmentNavigation).WithMany(p => p.PurchaseRequisitionDepartmentNavigations)
                .HasForeignKey(d => d.Department)
                .HasConstraintName("FK_PurchaseRequisition_Department_Location");

            entity.HasOne(d => d.ExpectedDeliveryLocationNavigation).WithMany(p => p.PurchaseRequisitionExpectedDeliveryLocationNavigations)
                .HasForeignKey(d => d.ExpectedDeliveryLocation)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PurchaseRequisition_Location");
        });

        modelBuilder.Entity<PurchaseRequisitionDetail>(entity =>
        {
            entity.HasKey(e => e.PurchaseRequisitionDetailId).HasName("PK__Purchase__D408F53003978D24");

            entity.ToTable("PurchaseRequisitionDetail");

            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.ItemMaster).WithMany(p => p.PurchaseRequisitionDetails)
                .HasForeignKey(d => d.ItemMasterId)
                .HasConstraintName("FK_PurchaseRequisitionDetail_ItemMaster");

            entity.HasOne(d => d.PurchaseRequisition).WithMany(p => p.PurchaseRequisitionDetails)
                .HasForeignKey(d => d.PurchaseRequisitionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PurchaseR__Purch__0C50D423");
        });

        modelBuilder.Entity<RequisitionDetail>(entity =>
        {
            entity.HasKey(e => e.RequisitionDetailId).HasName("PK__Requisit__13BEE89587291F72");

            entity.ToTable("RequisitionDetail");

            entity.Property(e => e.Quantity).HasColumnType("decimal(18, 8)");

            entity.HasOne(d => d.ItemMaster).WithMany(p => p.RequisitionDetails)
                .HasForeignKey(d => d.ItemMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ItemMaster_RequisitionDetail");

            entity.HasOne(d => d.RequisitionMaster).WithMany(p => p.RequisitionDetails)
                .HasForeignKey(d => d.RequisitionMasterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RequisitionMaster_RequisitionDetail");
        });

        modelBuilder.Entity<RequisitionMaster>(entity =>
        {
            entity.HasKey(e => e.RequisitionMasterId).HasName("PK__Requisit__2D532EDBB7555687");

            entity.ToTable("RequisitionMaster");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedDate).HasColumnType("datetime");
            entity.Property(e => e.PurposeOfRequest).HasMaxLength(200);
            entity.Property(e => e.ReferenceNumber).HasMaxLength(255);
            entity.Property(e => e.RequestedBy).HasMaxLength(50);
            entity.Property(e => e.RequisitionDate).HasColumnType("datetime");
            entity.Property(e => e.RequisitionType).HasMaxLength(50);

            entity.HasOne(d => d.RequestedFromLocation).WithMany(p => p.RequisitionMasterRequestedFromLocations)
                .HasForeignKey(d => d.RequestedFromLocationId)
                .HasConstraintName("FK_RequestedFromLocation_RequisitionMaster");

            entity.HasOne(d => d.RequestedToLocation).WithMany(p => p.RequisitionMasterRequestedToLocations)
                .HasForeignKey(d => d.RequestedToLocationId)
                .HasConstraintName("FK_RequestedToLocation_RequisitionMaster");
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
            entity.Property(e => e.ApprovedDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DueDate).HasColumnType("date");
            entity.Property(e => e.InvoiceDate).HasColumnType("date");
            entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.ReferenceNo)
                .HasMaxLength(20)
                .HasDefaultValueSql("('SI'+CONVERT([nvarchar](20),NEXT VALUE FOR [dbo].[SalesInvoiceReferenceNoSeq]))");
            entity.Property(e => e.ReferenceNumber).HasMaxLength(255);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.SalesOrder).WithMany(p => p.SalesInvoices)
                .HasForeignKey(d => d.SalesOrderId)
                .HasConstraintName("FK_SalesInvoice_SalesOrder");
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

            entity.HasOne(d => d.ItemBatch).WithMany(p => p.SalesInvoiceDetails)
                .HasForeignKey(d => new { d.ItemBatchBatchId, d.ItemBatchItemMasterId })
                .HasConstraintName("FK_SalesInvoiceDetail_ItemBatch");
        });

        modelBuilder.Entity<SalesOrder>(entity =>
        {
            entity.HasKey(e => e.SalesOrderId).HasName("PK__SalesOrd__B14003E2AF3CC5EF");

            entity.ToTable("SalesOrder");

            entity.Property(e => e.ApprovedBy).HasMaxLength(50);
            entity.Property(e => e.ApprovedDate).HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DeliveryDate).HasColumnType("date");
            entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");
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
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.ExcessAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.PaymentReferenceNo).HasMaxLength(20);
            entity.Property(e => e.ReceiptDate).HasColumnType("date");
            entity.Property(e => e.ReferenceNumber).HasMaxLength(255);
            entity.Property(e => e.ShortAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.PaymentMode).WithMany(p => p.SalesReceipts)
                .HasForeignKey(d => d.PaymentModeId)
                .HasConstraintName("FK_SalesReceipt_PaymentMode");
        });

        modelBuilder.Entity<SalesReceiptSalesInvoice>(entity =>
        {
            entity.HasKey(e => e.SalesReceiptSalesInvoiceId).HasName("PK__SalesRec__BCB7101771C12306");

            entity.ToTable("SalesReceiptSalesInvoice");

            entity.Property(e => e.CustomerBalance).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ExcessAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.SettledAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ShortAmount).HasColumnType("decimal(18, 2)");

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

            entity.Property(e => e.AddressLine1).HasMaxLength(255);
            entity.Property(e => e.AddressLine2).HasMaxLength(255);
            entity.Property(e => e.BusinessRegistrationNo).HasMaxLength(50);
            entity.Property(e => e.ContactPerson).HasMaxLength(50);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedDate).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.LastUpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.OfficeContactNo).HasMaxLength(20);
            entity.Property(e => e.Phone).HasMaxLength(12);
            entity.Property(e => e.Rating).HasColumnType("decimal(3, 1)");
            entity.Property(e => e.Remarks).HasMaxLength(255);
            entity.Property(e => e.SupplierLogoPath).HasMaxLength(255);
            entity.Property(e => e.SupplierName).HasMaxLength(50);
            entity.Property(e => e.VatregistrationNo)
                .HasMaxLength(50)
                .HasColumnName("VATRegistrationNo");

            entity.HasOne(d => d.BusinessType).WithMany(p => p.Suppliers)
                .HasForeignKey(d => d.BusinessTypeId)
                .HasConstraintName("FK_Supplier_BusinessType");

            entity.HasOne(d => d.Company).WithMany(p => p.Suppliers)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Supplier_Company");

            entity.HasOne(d => d.CompanyType).WithMany(p => p.Suppliers)
                .HasForeignKey(d => d.CompanyTypeId)
                .HasConstraintName("FK_Supplier_CompanyType");
        });

        modelBuilder.Entity<SupplierAttachment>(entity =>
        {
            entity.HasKey(e => e.SupplierAttachmentId).HasName("PK__Supplier__81D2082A25C2E70A");

            entity.ToTable("SupplierAttachment");

            entity.Property(e => e.AttachmentPath)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.Supplier).WithMany(p => p.SupplierAttachments)
                .HasForeignKey(d => d.SupplierId)
                .HasConstraintName("FK_SupplierAttachment_Supplier");
        });

        modelBuilder.Entity<SupplierCategory>(entity =>
        {
            entity.HasKey(e => e.SupplierCategoryId).HasName("PK__Supplier__50E449708214BB52");

            entity.ToTable("SupplierCategory");

            entity.HasOne(d => d.Category).WithMany(p => p.SupplierCategories)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK_SupplierCategory_Category");

            entity.HasOne(d => d.Supplier).WithMany(p => p.SupplierCategories)
                .HasForeignKey(d => d.SupplierId)
                .HasConstraintName("FK_SupplierCategory_Supplier");
        });

        modelBuilder.Entity<TransactionType>(entity =>
        {
            entity.HasKey(e => e.TransactionTypeId).HasName("PK__Transact__20266D0B3C56BB73");

            entity.ToTable("TransactionType");

            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
        });

        modelBuilder.Entity<Unit>(entity =>
        {
            entity.HasKey(e => e.UnitId).HasName("PK__Unit__44F5ECB57EA68CDD");

            entity.ToTable("Unit");

            entity.Property(e => e.UnitName).HasMaxLength(50);

            entity.HasOne(d => d.MeasurementType).WithMany(p => p.Units)
                .HasForeignKey(d => d.MeasurementTypeId)
                .HasConstraintName("FK_Unit_MeasurementTypeId");
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

            entity.HasOne(d => d.Location).WithMany(p => p.Users)
                .HasForeignKey(d => d.LocationId)
                .HasConstraintName("FK_User_Location");
        });

        modelBuilder.Entity<UserLocation>(entity =>
        {
            entity.HasKey(e => e.UserLocationId).HasName("PK__UserLoca__3C542CAAF9B7743C");

            entity.ToTable("UserLocation");

            entity.HasOne(d => d.Location).WithMany(p => p.UserLocations)
                .HasForeignKey(d => d.LocationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserLocation_Location");

            entity.HasOne(d => d.User).WithMany(p => p.UserLocations)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserLocation_User");
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
