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
};

export const ApplicationStatus = {
  APPLIED: 'applied',
  ONLINE_ASSESSMENT: 'online assessment',
  INTERVIEWING: 'interviewing',
  REJECTED: 'rejected',
  GHOSTED: 'ghosted'
};
