﻿using SriLankanParadise.ERP.UserManagement.Business_Service.Contracts;
using SriLankanParadise.ERP.UserManagement.DataModels;
using SriLankanParadise.ERP.UserManagement.Repository.Contracts;

namespace SriLankanParadise.ERP.UserManagement.Business_Service
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task AddCategory(Category category)
        {
            await _categoryRepository.AddCategory(category);
        }

        public async Task<IEnumerable<Category>> GetAll()
        {
            return await _categoryRepository.GetAll();
        }

        public async Task<IEnumerable<Category>> GetCategoriesByCompanyId(int companyId)
        {
            return await _categoryRepository.GetCategoriesByCompanyId(companyId);
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesByCompanyId(int companyId)
        {
            return await _categoryRepository.GetAllCategoriesByCompanyId(companyId);
        }

        public async Task<Category> GetCategoryByCategoryId(int categoryId)
        {
            return await _categoryRepository.GetCategoryByCategoryId(categoryId);
        }

        public async Task UpdateCategory(int categoryId, Category category)
        {
            await _categoryRepository.UpdateCategory(categoryId, category);
        }

        public async Task DeleteCategory(int categoryId)
        {
            await _categoryRepository.DeleteCategory(categoryId);
        }
    }
}
