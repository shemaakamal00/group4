export type Profile ={
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'user' | 'admin';
  level_id: number;
  created_at: string;
  subscription_level:{
    level_name: string;
    access_level: number;
  };
};