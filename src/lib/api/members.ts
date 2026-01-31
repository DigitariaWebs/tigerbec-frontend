/**
 * Members API Module
 * Handles all member-related operations
 */

import { BaseApiClient } from './base';
import type { Profile, Car, MemberStats } from '@/types';

export class MembersApi extends BaseApiClient {
  /**
   * Member signup with email and password (public endpoint)
   */
  async signup(data: {
    email: string;
    password: string;
    name: string;
    dateOfBirth: string;
    phone?: string;
  }): Promise<{ member: Profile; access_token: string }> {
    console.log('[MEMBERS API] signup called');
    
    const response = await fetch(`${this.baseURL}/members/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    console.log('[MEMBERS API] signup response:', result);
    
    // Store token in localStorage and cookies
    if (typeof window !== 'undefined' && result.access_token) {
      localStorage.setItem('member_token', result.access_token);
      if (result.member) {
        localStorage.setItem('member_user', JSON.stringify(result.member));
        console.log('[MEMBERS API] Stored member in localStorage:', result.member);
      }
      // Set cookie for middleware
      document.cookie = `member_token=${result.access_token}; path=/; samesite=lax`;
    }
    
    return result;
  }

  /**
   * Member signin with email and password (public endpoint)
   */
  async signin(data: {
    email: string;
    password: string;
  }): Promise<{ member: Profile; access_token: string }> {
    console.log('[MEMBERS API] signin called with:', { email: data.email });
    
    const response = await fetch(`${this.baseURL}/members/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    console.log('[MEMBERS API] signin response:', result);
    
    // Store token in localStorage and cookies
    if (typeof window !== 'undefined' && result.access_token) {
      localStorage.setItem('member_token', result.access_token);
      if (result.member) {
        localStorage.setItem('member_user', JSON.stringify(result.member));
        console.log('[MEMBERS API] Stored member in localStorage:', result.member);
      }
      // Set cookie for middleware
      document.cookie = `member_token=${result.access_token}; path=/; samesite=lax`;
    }
    
    return result;
  }

  /**
   * Member signin with OAuth provider (public endpoint)
   */
  async signinWithOAuth(data: {
    provider: 'google' | 'github' | 'azure';
    access_token: string;
  }): Promise<{ member: Profile; access_token: string }> {
    console.log('[MEMBERS API] signinWithOAuth called with provider:', data.provider);
    
    const response = await fetch(`${this.baseURL}/members/oauth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    console.log('[MEMBERS API] signinWithOAuth response:', result);
    
    // Store token in localStorage and cookies
    if (typeof window !== 'undefined' && result.access_token) {
      localStorage.setItem('member_token', result.access_token);
      if (result.member) {
        localStorage.setItem('member_user', JSON.stringify(result.member));
        console.log('[MEMBERS API] Stored member in localStorage:', result.member);
      }
      // Set cookie for middleware
      document.cookie = `member_token=${result.access_token}; path=/; samesite=lax`;
    }
    
    return result;
  }

  /**
   * Member logout
   */
  async signout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('member_token');
      localStorage.removeItem('member_user');
      // Clear cookie
      document.cookie = 'member_token=; path=/; samesite=lax; max-age=0';
    }
  }

  /**
   * Get current member profile
   */
  async getMe(): Promise<Profile> {
    return this.request<Profile>('/members/me');
  }

  /**
   * Update current member profile
   */
  async updateMe(data: {
    name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    avatar_url?: string;
  }): Promise<Profile> {
    return this.request<Profile>('/members/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update current member password
   */
  async updateMyPassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/members/me/password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete current member account
   */
  async deleteMe(): Promise<{ message: string }> {
    const result = await this.request<{ message: string }>('/members/me', {
      method: 'DELETE',
    });
    
    // Clear local storage and cookies on successful deletion
    if (typeof window !== 'undefined') {
      localStorage.removeItem('member_token');
      localStorage.removeItem('member_user');
      document.cookie = 'member_token=; path=/; samesite=lax; max-age=0';
    }
    
    return result;
  }

  /**
   * Get current member's cars
   */
  async getMyCars(): Promise<Car[]> {
    return this.request<Car[]>('/members/me/cars');
  }

  /**
   * Get current member's stats
   */
  async getMyStats(): Promise<MemberStats> {
    return this.request<MemberStats>('/members/me/stats');
  }

  /**
   * Get current member's dashboard data
   */
  async getMyDashboard(): Promise<{
    member: { id: string; name: string; email: string };
    balance: number;
    cars: { total: number; inInventory: number; sold: number };
    financial: {
      totalInvestment: number;
      totalRevenue: number;
      totalGrossProfit: number;
      totalNetProfit: number;
      totalFranchiseFees: number;
      totalAdditionalExpenses: number;
      profitMargin: number;
      netProfitMargin: number;
    };
    recentSales: Array<{
      id: string;
      make_snapshot: string;
      model_snapshot: string;
      year_snapshot: number;
      sold_price: number;
      sold_date: string;
      profit: number;
    }>;
    tasks: {
      total: number;
      todo: number;
      in_progress: number;
      completed: number;
      overdue: number;
    };
    recentTasks: Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
      due_date?: string;
    }>;
  }> {
    return this.request('/members/me/dashboard');
  }

  /**
   * Get all members (admin only)
   */
  async getAll(): Promise<Profile[]> {
    return this.request<Profile[]>('/members');
  }

  /**
   * Get all members with stats
   */
  async getAllWithStats(): Promise<MemberStats[]> {
    const response = await this.request<{ data: MemberStats[] }>('/members');
    return response.data;
  }

  /**
   * Get member by ID
   */
  async getById(id: string): Promise<Profile> {
    return this.request<Profile>(`/members/${id}`);
  }

  /**
   * Get member stats
   */
  async getStats(id: string): Promise<MemberStats> {
    return this.request<MemberStats>(`/members/${id}/stats`);
  }

  /**
   * Get member's cars
   */
  async getCars(id: string): Promise<Car[]> {
    return this.request<Car[]>(`/members/${id}/cars`);
  }



  /**
   * Modify member profile using PATCH (admin only)
   */
  async modify(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      date_of_birth?: string;
      avatar_url?: string;
      company?: string;
      country?: string;
      status?: 'active' | 'inactive';
    }
  ): Promise<Profile> {
    return this.request<Profile>(`/members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const membersApi = new MembersApi();
