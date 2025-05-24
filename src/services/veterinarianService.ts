import { apiClient } from './api';
import type { User, Pet } from '../types';

export interface CreateVeterinarianRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface UpdateVeterinarianRequest {
  email?: string;
  fullName?: string;
  password?: string;
}

export const veterinarianService = {
  async getAllVeterinarians(): Promise<User[]> {
    return apiClient.get('/veterinarians');
  },

  async getVeterinarianById(id: number): Promise<User> {
    return apiClient.get(`/veterinarians/${id}`);
  },

  async getPetsByVeterinarian(veterinarianId: number): Promise<Pet[]> {
    return apiClient.get(`/veterinarians/${veterinarianId}/pets`);
  },

  async createVeterinarian(veterinarianData: CreateVeterinarianRequest): Promise<User> {
    return apiClient.post('/veterinarians', veterinarianData);
  },

  async updateVeterinarian(id: number, veterinarianData: UpdateVeterinarianRequest): Promise<User> {
    return apiClient.put(`/veterinarians/${id}`, veterinarianData);
  },

  async assignPetToVeterinarian(petId: number, veterinarianId: number): Promise<Pet> {
    return apiClient.post(`/veterinarians/${veterinarianId}/pets/${petId}`);
  },

  async removePetFromVeterinarian(petId: number, veterinarianId: number): Promise<void> {
    return apiClient.delete(`/veterinarians/${veterinarianId}/pets/${petId}`);
  }
};