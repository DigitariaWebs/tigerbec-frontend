/**
 * Fund Requests API Client
 * Handles all fund request operations for members
 */

import { BaseApiClient } from './base';

export interface FundRequest {
  id: string;
  member_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  member_name?: string;
  member_email?: string;
  reviewer_name?: string;
  reviewer_email?: string;
}

export interface CreateFundRequestDto {
  amount: number;
  notes?: string;
}

export interface FundRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  total_amount_requested: number;
  total_amount_approved: number;
}

class FundRequestsApiClient extends BaseApiClient {
  /**
   * Create a new fund request
   */
  async create(data: CreateFundRequestDto): Promise<FundRequest> {
    const response = await this.request<FundRequest>('/fund-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }

  /**
   * Get all fund requests for the current member
   */
  async getAll(): Promise<FundRequest[]> {
    const response = await this.request<FundRequest[]>('/fund-requests', {
      method: 'GET',
    });
    return response;
  }

  /**
   * Get a specific fund request by ID
   */
  async getById(id: string): Promise<FundRequest> {
    const response = await this.request<FundRequest>(`/fund-requests/${id}`, {
      method: 'GET',
    });
    return response;
  }

  /**
   * Get fund request statistics
   */
  async getStats(): Promise<FundRequestStats> {
    const response = await this.request<FundRequestStats>('/fund-requests/stats', {
      method: 'GET',
    });
    return response;
  }
}

export const fundRequestsApi = new FundRequestsApiClient();
