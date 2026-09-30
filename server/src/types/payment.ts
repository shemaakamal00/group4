export type Payment = {
  id: string;
  user_id: string;
  subscription_level_id: number;
  total: number;
  status: "Genomförd" | "Misslyckad" | "Väntar";
  created_at: string;
  paid_at: string | null;
};