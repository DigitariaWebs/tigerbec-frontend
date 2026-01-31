/**
 * Tasks API Module
 * Handles all task-related operations
 */

import { BaseApiClient } from './base';

export interface Task {
  id: string;
  member_id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  total: number;
  todo: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

export interface CreateTaskDto {
  member_id: string;
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  due_date?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  due_date?: string;
  completed_at?: string;
}

export class TasksApi extends BaseApiClient {
  /**
   * Get all tasks (admin only)
   */
  async getAllTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks');
  }

  /**
   * Get tasks for a specific member
   */
  async getTasksByMemberId(memberId: string): Promise<Task[]> {
    return this.request<Task[]>(`/tasks/member/${memberId}`);
  }

  /**
   * Get task statistics for a member
   */
  async getTaskStatsByMember(memberId: string): Promise<TaskStats> {
    return this.request<TaskStats>(`/tasks/member/${memberId}/stats`);
  }

  /**
   * Get a single task by ID
   */
  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a task
   */
  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const tasksApi = new TasksApi();
