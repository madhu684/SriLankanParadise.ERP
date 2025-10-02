using Microsoft.EntityFrameworkCore;
using SriLankanParadise.ERP.UserManagement.Data;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;


namespace SriLankanParadise.ERP.UserManagement.Repository
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly ErpSystemContext _dbContext;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public SupplierRepository(ErpSystemContext dbContext, IWebHostEnvironment hostingEnvironment)
        {
            _dbContext = dbContext;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<IEnumerable<Supplier>> GetSuppliersByCompanyId(int companyId)
        {
            try
            {
                var suppliers = await _dbContext.Suppliers
                    .Where(s => s.CompanyId == companyId)
                    .Include(s => s.CompanyType)
                    .Include(s => s.BusinessType)
                    .Include(s => s.SupplierCategories)
                    .ThenInclude(sc => sc.Category)
                    .Include(s => s.SupplierAttachments.Where(sa => sa.Status == 1))
                    .ToListAsync();

                if (suppliers.Any())
                {
                    return suppliers;
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task AddSupplier(Supplier supplier)
        {
            try
            {
                _dbContext.Suppliers.Add(supplier);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Supplier> GetSupplierBySupplierId(int supplierId)
        {
            try
            {
                var supplier = await _dbContext.Suppliers
                    .Where(s => s.SupplierId == supplierId)
                    .FirstOrDefaultAsync();

                return supplier;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task UpdateSupplier(int supplierId, Supplier supplier)
        {
            try
            {
                var existSupplier = await _dbContext.Suppliers.FindAsync(supplierId);

                if (existSupplier != null)
                {
                    _dbContext.Entry(existSupplier).CurrentValues.SetValues(supplier);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task DeleteSupplier(int supplierId)
        {
            try
            {
                var supplier= await _dbContext.Suppliers.FindAsync(supplierId);

                if (supplier != null)
                {
                    _dbContext.Suppliers.Remove(supplier);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<string> SaveSupplierLogo(IFormFile file, string fileName)
        {
            try
            {

                var uploadDirectory = Path.Combine("Uploads", "Supplier", "Logos");

                // Ensure the directory exists
                if (!Directory.Exists(uploadDirectory))
                {
                    Directory.CreateDirectory(uploadDirectory);
                }

                // Combine the directory and filename to get the full path
                var filePath = Path.Combine(uploadDirectory, fileName);

                // Save the file to the server
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                return filePath; 
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> SaveSupplierAttachment(IFormFile file, string fileName)
        {
            try
            {

                var uploadDirectory = Path.Combine("Uploads", "Supplier", "Attachments");
                // Ensure the directory exists
                if (!Directory.Exists(uploadDirectory))
                {
                    Directory.CreateDirectory(uploadDirectory);
                }

                // Combine the directory and filename to get the full path
                var filePath = Path.Combine(uploadDirectory, fileName);

                // Save the file to the server
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                return filePath; 
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> GetSupplierLogoPathAsync(int supplierId)
        {
            var supplier = await _dbContext.Suppliers.FindAsync(supplierId);
            return supplier?.SupplierLogoPath;
        }

    }
}
