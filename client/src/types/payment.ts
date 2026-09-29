export type PaymentReceipt = {
  id?: string;
  user_id?: string;
  subscription_level_id?: number;
  total: number;
  status?: string;
  created_at?: string;
  paid_at?: string | null;
  level_name: string;
  is_free?: boolean;
};