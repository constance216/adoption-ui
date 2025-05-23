import { apiClient } from './api';
import type { Breed } from '../types';

export interface CreateBreedRequest {
  name: string;
  categoryId: number;
  description?: string;
}

export const breedService = {
  async getAllBreeds(): Promise<Breed[]> {
    return apiClient.get('/breeds');
  },

  async getBreedById(id: number): Promise<Breed> {
    return apiClient.get(`/breeds/${id}`);
  },

  async getBreedByName(name: string): Promise<Breed> {
    return apiClient.get(`/breeds/name/${name}`);
  },

  async getBreedsByCategory(categoryId: number): Promise<Breed[]> {
    return apiClient.get(`/breeds/category/${categoryId}`);
  },

  async createBreed(breedData: CreateBreedRequest): Promise<Breed> {
    return apiClient.post('/breeds', breedData);
  },

  async updateBreed(id: number, breedData: CreateBreedRequest): Promise<Breed> {
    return apiClient.put(`/breeds/${id}`, breedData);
  },

  async deleteBreed(id: number): Promise<void> {
    return apiClient.delete(`/breeds/${id}`);
  }
};