import { ReactNode } from 'react';

export interface Project {
  project_id: number;
  project_name: string;
  project_description: string;
  project_status: string;
  project_created_at: string;
  user_name: string;
  user_email: string;
}

export type ProjectStatus = 'completed' | 'in_progress' | 'pending';

export interface ProjectStats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
}

export interface StatusConfig {
  color: string;
  icon?: ReactNode;
}