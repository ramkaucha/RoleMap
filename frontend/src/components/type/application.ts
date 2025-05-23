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
  TO_APPLY: 'To Apply',
};

export const applicationStatusOptions = [
  'Applied',
  'Online Assessment',
  'Interviewing',
  'Rejected',
  'Ghosted',
  'To Apply',
];

export interface ApplicationCreate {
  company: string;
  role: string;
  status: string;
  location: string;
  category: string;
  link: string;
  comments?: string;
  date_applied: Date;
}
