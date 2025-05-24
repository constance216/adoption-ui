import { apiClient } from './api';
import type { Pet } from '../types';

interface Shelter {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface CreateShelterRequest {
  name: string;
  address: string;
  email: string;
  phone: string;
}

interface UpdateShelterRequest {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export const shelterService = {
  async getAllShelters(): Promise<Shelter[]> {
    return apiClient.get('/shelters');
  },

  async getShelter(id: number): Promise<Shelter> {
    return apiClient.get(`/shelters/${id}`);
  },

  async createShelter(data: CreateShelterRequest): Promise<Shelter> {
    return apiClient.post('/shelters', data);
  },

  async updateShelter(id: number, data: UpdateShelterRequest): Promise<Shelter> {
    return apiClient.put(`/shelters/${id}`, data);
  },

  async deleteShelter(id: number): Promise<void> {
    return apiClient.delete(`/shelters/${id}`);
  },

  async getShelterPets(shelterId: number): Promise<Pet[]> {
    return apiClient.get(`/shelters/${shelterId}/pets`);
  },
};