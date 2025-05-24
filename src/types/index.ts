// User types
export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: 'USER' | 'ADMIN' | 'SHELTER' | 'VETERINARIAN';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role?: string;
  }
  
  export interface AuthResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    role: string;
  }
  
  // Category types
  export interface Category {
    id: number;
    name: string;
    createdAt: string;
  }
  
  // Breed types
  export interface Breed {
    id: number;
    name: string;
    description?: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Pet types
  export interface Pet {
    id: number;
    name: string;
    breed?: {
      id: number;
      name: string;
    };
    category?: {
      id: number;
      name: string;
    };
    age: number;
    description?: string;
    image?: string;
    gender: 'MALE' | 'FEMALE';
    status: 'ACTIVE' | 'ADOPTED' | 'UNAVAILABLE';
    owner?: UserSummary;
    shelter?: UserSummary;
    veterinarian?: UserSummary;
    adoptedBy?: UserSummary;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UserSummary {
    id: number;
    username: string;
    fullName: string;
  }
  
  // Adoption types
  export interface Adoption {
    id: number;
    pet: PetSummary;
    adopter: UserSummary;
    adoptionDate: string;
    notes?: string;
    status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PetSummary {
    id: number;
    name: string;
    breed: string;
    category: string;
    age: number;
    gender: string;
    status: string;
    image?: string;
  }
  
  export interface AdoptionRequest {
    petId: number;
    adopterId: number;
    notes?: string;
  }
  
  // API Response types
  export interface ApiResponse<T> {
    data: T;
    message?: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
  }
  
  // Error types
  export interface ApiError {
    timestamp: string;
    message: string;
    details: string;
  }