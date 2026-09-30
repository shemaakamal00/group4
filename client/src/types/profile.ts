export type Profile = {
  first_name: string | null;
  last_name: string | null;
  role: "user" | "admin";
  level_name: string;
  access_level: number;
};