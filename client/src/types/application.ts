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
