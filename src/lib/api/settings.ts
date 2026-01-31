/**
 * Settings API Client
 * Handles fetching system settings
 */

import { BaseApiClient } from './base';

export interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

class SettingsApiClient extends BaseApiClient {
  /**
   * Get a specific setting by key
   */
  async getByKey(key: string): Promise<AppSetting> {
    return this.request<AppSetting>(`/admin/settings/${key}`);
  }

  /**
   * Get the franchise fee percentage (public endpoint, no auth required)
   */
  async getFranchiseFee(): Promise<number> {
    const setting = await this.request<AppSetting>('/admin/settings/public/franchise-fee', {
      skipAuth: true,
    });
    return parseFloat(setting.setting_value);
  }
}

export const settingsApi = new SettingsApiClient();
