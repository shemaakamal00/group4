export type GoalCriteria = {
    id: string;
    goal_id: string;
    criteria_name: string;
    is_done: boolean;
    created_at: string;
    updated_at: string;
  };
  
  export type Goal = {
    id: string;
    user_id: string;
    goal_name: string;
    goal_description: string | null;
    goal_criteria: GoalCriteria[];
    created_at: string;
    updated_at: string;
  };
  
  export type GoalUsage = {
    used: number;
    limit: number | null;
    level_name: string;
    access_level: number;
  };