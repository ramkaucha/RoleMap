export interface HistoryEvent {
  status: string;
  date: Date | string;
  notes?: string;
}

export type Application = {
  id: number;
  company: string;
  role: string;
  status: string;
  location: string;
  link: string;
  comments?: string;
  category: string;
  date_applied: Date;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  recruiter?: string;
  application_method?: string;
  upcoming_events?: string;
  history?: HistoryEvent[];
};

export const ApplicationStatus = {
  APPLIED: 'Applied',
  ONLINE_ASSESSMENT: 'Online Assessment',
  INTERVIEWING: 'Interviewing',
  REJECTED: 'Rejected',
  GHOSTED: 'Ghosted',
};
