import { apiClient } from './api';
import type { Pet } from '../types';

export interface CreatePetRequest {
  name: string;
  breedId?: number;
  categoryId: number;
  age: number;
  description?: string;
  image?: string;
  gender: 'MALE' | 'FEMALE';
  ownerId?: number;
  shelterId?: number;
  veterinarianId?: number;
}

export interface UpdatePetRequest {
  name?: string;
  breedId?: number;
  categoryId?: number;
  age?: number;
  description?: string;
  image?: string;
  gender?: 'MALE' | 'FEMALE';
  status?: 'ACTIVE' | 'ADOPTED' | 'UNAVAILABLE';
}

export const petService = {
  async getAllPets(): Promise<Pet[]> {
    return apiClient.get('/pets');
  },

  async getPetById(id: number): Promise<Pet> {
    return apiClient.get(`/pets/${id}`);
  },

  async getPetsByStatus(status: string): Promise<Pet[]> {
    return apiClient.get(`/pets/status/${status}`);
  },

  async getPetsByCategory(categoryId: number): Promise<Pet[]> {
    return apiClient.get(`/pets/category/${categoryId}`);
  },

  async getPetsByBreed(breedId: number): Promise<Pet[]> {
    return apiClient.get(`/pets/breed/${breedId}`);
  },

  async createPet(petData: CreatePetRequest): Promise<Pet> {
    return apiClient.post('/pets', petData);
  },

  async updatePet(id: number, petData: UpdatePetRequest): Promise<Pet> {
    return apiClient.put(`/pets/${id}`, petData);
  },

  async deletePet(id: number): Promise<void> {
    return apiClient.delete(`/pets/${id}`);
  },

  async assignShelter(petId: number, shelterId: number): Promise<Pet> {
    return apiClient.post(`/pets/${petId}/shelter/${shelterId}`);
  },

  async assignVeterinarian(petId: number, veterinarianId: number): Promise<Pet> {
    return apiClient.post(`/pets/${petId}/veterinarian/${veterinarianId}`);
  },

  async adoptPet(petId: number, adopterId: number): Promise<Pet> {
    return apiClient.post(`/pets/${petId}/adopt/${adopterId}`);
  }
};