export interface Project {
    project_id: number;
    project_name: string;
    project_description: string;
    project_status: 'completed' | 'in_progress' | 'pending';
    project_created_at: string;
    user_name: string;
    user_email: string;
  }
  
  export interface ProjectStats {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
  }
  
  export interface CalendarProps {
    value: Date;
    onChange?: (date: Date) => void;
  }