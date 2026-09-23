export type Application = {
  id: string;
  user_id: string;
  title: string;
  company: string | null;
  link: string | null;
  notes: string | null;
  application_status_id: number;
  status_changed_at: string | null;
  applied_at: string | null;
  response_date: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationUsage = {
  used: number;
  limit: number | null;
  level_name: string;
};

export type StatusCount = {
  status_id: number;
  status_name: string;
  count: number;
};

export type MonthlyCount = {
  month: string;
  count: number;
};

export type Insights = {
  response_rate: number;
  average_days_to_response: number | null;
};

export type ApplicationStats = {
  level_name: string;
  access_level: number;
  total: number;
  counts_by_status: StatusCount[];
  applications_per_month?: MonthlyCount[];
  insights?: Insights;
};
