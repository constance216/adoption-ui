import { apiClient } from './api';

export interface DashboardStats {
  totalPets: number;
  totalAdoptions: number;
  totalShelters: number;
  totalUsers: number;
  totalCategories: number;
  totalBreeds: number;
  availablePets: number;
  adoptedPets: number;
  pendingAdoptions: number;
}

export const statsService = {
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get('/stats');
  },
}; 