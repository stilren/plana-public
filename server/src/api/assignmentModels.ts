export interface ProblemStatement {
  chores: ChoreCore[];
  users: UserCore[];
  customShareOfChores: boolean;
}

export interface EffortRating {
  userId: string;
  effort: number;
}

export interface Solution {
  maximumDiff: number;
  totalDiff: number;
  choreToUserMap: KeyValuePair[];
  isPerfect: boolean;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface UserCore {
  userId: string;
  shareOfChoresPercent: number;
}

export interface ChoreCore {
  choreId: string;
  effortRatings: EffortRating[];
  lockedToUserId: string;
}
