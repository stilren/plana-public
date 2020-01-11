/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ChoreStatus {
  ARCHIVE = "ARCHIVE",
  DONE = "DONE",
  RECURRING = "RECURRING",
  TODO = "TODO",
  UPNEXT = "UPNEXT",
}

export enum RecurrenceType {
  AUTOMATIC = "AUTOMATIC",
  MANUAL = "MANUAL",
  ONCE = "ONCE",
}

export enum TodoState {
  DONE = "DONE",
  NOT_IN_TODO = "NOT_IN_TODO",
  TODO = "TODO",
}

export interface AutomaticRecurrenceInput {
  nextOccurence?: any | null;
  weekCadence?: number | null;
}

export interface ChoreInput {
  name: string;
  description?: string | null;
  isUpnext: boolean;
  todoState?: TodoState | null;
  assignee?: string | null;
  recurrenceType: RecurrenceType;
  recurrenceInput?: AutomaticRecurrenceInput | null;
  lockedToUser?: LockedToUserInput | null;
  effort?: EffortInput | null;
}

export interface EffortInput {
  userId: string;
  effort: number;
  effortId?: string | null;
}

export interface LockedToUserInput {
  userId: string;
  locked: boolean;
  choreId: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
