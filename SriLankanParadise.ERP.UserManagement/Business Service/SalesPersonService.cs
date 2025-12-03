using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class SalesPersonService : ISalesPersonService
    {
        private readonly ISalesPersonRepository _salesPersonRepository;

        public SalesPersonService(ISalesPersonRepository salesPersonRepository)
        {
            _salesPersonRepository = salesPersonRepository;
        }

        // Create a new SalesPerson
        public async Task AddSalesPerson(SalesPerson salesPerson)
        {
            await _salesPersonRepository.AddSalesPerson(salesPerson);
        }

        // Get all SalesPersons
        public async Task<IEnumerable<SalesPerson>> GetAll()
        {
            return await _salesPersonRepository.GetAll();
        }

        // Get SalesPerson by Id
        public async Task<SalesPerson?> GetById(int id)
        {
            return await _salesPersonRepository.GetById(id);
        }

        // Update SalesPerson (PUT)
        public async Task Update(int salesPersonId, SalesPerson salesPerson)
        {
            await _salesPersonRepository.Update(salesPersonId, salesPerson);
        }

        // Delete SalesPerson (can be soft or hard delete)
        public async Task Delete(int salesPersonId)
        {
            await _salesPersonRepository.Delete(salesPersonId);
        }

        // Additional methods like patch or active/inactive toggle
        public async Task ActiveDeactiveSalesPerson(int salesPersonId, bool isActive)
        {
            var salesPerson = await _salesPersonRepository.GetById(salesPersonId);
            if (salesPerson != null)
            {
                salesPerson.IsActive = isActive;
                await _salesPersonRepository.Update(salesPersonId, salesPerson);
            }
        }
    }
}
