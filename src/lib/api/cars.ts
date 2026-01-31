/**
 * Cars API Module
 * Handles all car-related operations
 */

import { BaseApiClient } from './base';

export interface Car {
  id: string;
  member_id: string;
  vin: string;
  make?: string;
  model: string;
  year: number;
  purchase_price: number;
  purchase_date: string;
  status: 'IN_STOCK' | 'SOLD';
  sale_price?: number;
  sale_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCarDto {
  vin: string;
  make?: string;
  model: string;
  year: number;
  purchase_price: string;
  purchase_date?: string;
}

export interface UpdateCarDto {
  make?: string;
  model?: string;
  year?: number;
  purchase_price?: string;
  purchase_date?: string;
}

export interface MarkAsSoldDto {
  sale_price: string;
  sale_date: string;
}

export interface QueryCarsDto {
  status?: 'IN_STOCK' | 'SOLD';
  search?: string;
  sort?: 'purchase_date' | 'year' | 'model';
  order?: 'asc' | 'desc';
}

export class CarsApi extends BaseApiClient {
  /**
   * Create a new car
   */
  async createCar(data: CreateCarDto): Promise<Car> {
    return this.request<Car>('/cars', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get all cars for current member
   */
  async getCars(query?: QueryCarsDto): Promise<Car[]> {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.search) params.append('search', query.search);
    if (query?.sort) params.append('sort', query.sort);
    if (query?.order) params.append('order', query.order);
    
    const queryString = params.toString();
    return this.request<Car[]>(`/cars${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Get a single car by ID
   */
  async getCarById(id: string): Promise<Car> {
    return this.request<Car>(`/cars/${id}`);
  }

  /**
   * Update a car
   */
  async updateCar(id: string, data: UpdateCarDto): Promise<Car> {
    return this.request<Car>(`/cars/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Mark a car as sold
   */
  async markAsSold(id: string, data: MarkAsSoldDto): Promise<Car> {
    return this.request<Car>(`/cars/${id}/mark-sold`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a car
   */
  async deleteCar(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/cars/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get sales history
   */
  async getSalesHistory(): Promise<Car[]> {
    return this.request<Car[]>('/cars/sales-history');
  }
}

// Export singleton instance
export const carsApi = new CarsApi();
