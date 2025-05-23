import { apiClient } from './api';
import type { Category } from '../types';

export interface CreateCategoryRequest {
  name: string;
}

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    return apiClient.get('/categories');
  },

  async getCategoryById(id: number): Promise<Category> {
    return apiClient.get(`/categories/${id}`);
  },

  async getCategoryByName(name: string): Promise<Category> {
    return apiClient.get(`/categories/name/${name}`);
  },

  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    return apiClient.post('/categories', categoryData);
  },

  async updateCategory(id: number, categoryData: CreateCategoryRequest): Promise<Category> {
    return apiClient.put(`/categories/${id}`, categoryData);
  },

  async deleteCategory(id: number): Promise<void> {
    return apiClient.delete(`/categories/${id}`);
  }
};