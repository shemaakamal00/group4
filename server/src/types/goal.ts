export type GoalCriteriaInput = {
    criteria_name: string;
    is_done: boolean;
};

export type GoalInput = {
    goal_name: string;
    goal_description: string | null;
    criteria: GoalCriteriaInput[];
};