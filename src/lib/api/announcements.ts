/**
 * Announcements API Client
 * Handles viewing announcements for members
 */

import { BaseApiClient } from './base';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'incentive' | 'alert' | 'celebration';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  image_url?: string;
  created_by_user?: {
    id: string;
    name: string;
    email: string;
  };
}

class AnnouncementsApiClient extends BaseApiClient {
  /**
   * Get active announcements
   */
  async getActive(): Promise<Announcement[]> {
    return this.request<Announcement[]>('/announcements/active');
  }
}

export const announcementsApi = new AnnouncementsApiClient();
