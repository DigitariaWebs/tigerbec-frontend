/**
 * Inventory Requests API Client
 * Handles car inventory request operations for members
 */

import { BaseApiClient } from './base';

export interface InventoryRequest {
  id: string;
  member_id: string;
  vin: string;
  make?: string;
  model: string;
  year: number;
  purchase_price: number;
  purchase_date?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  member_name?: string;
  member_email?: string;
  reviewer_name?: string;
}

export interface CreateInventoryRequestDto {
  vin: string;
  make?: string;
  model: string;
  year: number;
  purchase_price: string;
  purchase_date?: string;
  notes?: string;
}

export interface InventoryRequestFilters {
  status?: 'pending' | 'approved' | 'rejected';
}

class InventoryRequestsApiClient extends BaseApiClient {
  /**
   * Create a new inventory request
   */
  async create(data: CreateInventoryRequestDto): Promise<InventoryRequest> {
    return this.request<InventoryRequest>('/inventory-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get member's own requests
   */
  async getMyRequests(filters?: InventoryRequestFilters): Promise<InventoryRequest[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = queryString ? `/inventory-requests/my-requests?${queryString}` : '/inventory-requests/my-requests';
    
    return this.request<InventoryRequest[]>(url);
  }

  /**
   * Get single request by ID
   */
  async getById(id: string): Promise<InventoryRequest> {
    return this.request<InventoryRequest>(`/inventory-requests/${id}`);
  }
}

export const inventoryRequestsApi = new InventoryRequestsApiClient();
