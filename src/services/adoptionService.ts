import { apiClient } from './api';
import type { Adoption, AdoptionRequest } from '../types';

export interface UpdateAdoptionStatusRequest {
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateAdoptionRequest {
  notes?: string;
  adoptionDate?: string;
}

export const adoptionService = {
  async getAllAdoptions(): Promise<Adoption[]> {
    return apiClient.get('/adoptions');
  },

  async getAdoptionById(id: number): Promise<Adoption> {
    return apiClient.get(`/adoptions/${id}`);
  },

  async getAdoptionsByAdopter(adopterId: number): Promise<Adoption[]> {
    return apiClient.get(`/adoptions/adopter/${adopterId}`);
  },

  async getAdoptionsByPet(petId: number): Promise<Adoption[]> {
    return apiClient.get(`/adoptions/pet/${petId}`);
  },

  async getAdoptionsByStatus(status: string): Promise<Adoption[]> {
    return apiClient.get(`/adoptions/status/${status}`);
  },

  async createAdoption(adoptionData: AdoptionRequest): Promise<Adoption> {
    return apiClient.post('/adoptions', adoptionData);
  },

  async updateAdoptionStatus(id: number, statusData: UpdateAdoptionStatusRequest): Promise<Adoption> {
    return apiClient.put(`/adoptions/${id}/status`, statusData);
  },

  async updateAdoption(id: number, adoptionData: UpdateAdoptionRequest): Promise<Adoption> {
    return apiClient.put(`/adoptions/${id}`, adoptionData);
  },

  async deleteAdoption(id: number): Promise<void> {
    return apiClient.delete(`/adoptions/${id}`);
  }
};