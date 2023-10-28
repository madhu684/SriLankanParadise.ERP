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

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=(local);Database=erp-system;User Id=sa;Password=local__pass@#;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Company>(entity =>
        {
            entity.ToTable("Company");

            entity.Property(e => e.CompanyName).HasMaxLength(50);
            entity.Property(e => e.SubscriptionExpiredDate).HasColumnType("datetime");

            entity.HasOne(d => d.SubscriptionPlan).WithMany(p => p.Companies)
                .HasForeignKey(d => d.SubscriptionPlanId)
                .HasConstraintName("FK_Company_Subscription");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.ToTable("Permission");

            entity.Property(e => e.PermissionName).HasMaxLength(100);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Role");

            entity.Property(e => e.RoleName)
                .HasMaxLength(10)
                .IsFixedLength();
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

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.ToTable("Subscription");

            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.PlanName).HasMaxLength(50);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");

            entity.Property(e => e.ContactNo).HasMaxLength(12);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Firstname).HasMaxLength(50);
            entity.Property(e => e.Lastname).HasMaxLength(50);
            entity.Property(e => e.PasswordHash).HasMaxLength(500);
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.Company).WithMany(p => p.Users)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_User_Company");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.UserRoleId).HasName("PK_UserRole_1");

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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
