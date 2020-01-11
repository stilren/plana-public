/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: selectHousehold
// ====================================================

export interface selectHousehold_selectHousehold_households_members {
  __typename: "User";
  name: string;
  id: string;
}

export interface selectHousehold_selectHousehold_households_invites {
  __typename: "User";
  name: string;
  id: string;
  email: string | null;
}

export interface selectHousehold_selectHousehold_households {
  __typename: "Household";
  members: selectHousehold_selectHousehold_households_members[];
  id: string;
  name: string;
  invites: (selectHousehold_selectHousehold_households_invites | null)[] | null;
}

export interface selectHousehold_selectHousehold_selectedHousehold {
  __typename: "Household";
  id: string;
  name: string;
}

export interface selectHousehold_selectHousehold_invites {
  __typename: "Household";
  name: string;
  id: string;
}

export interface selectHousehold_selectHousehold {
  __typename: "User";
  households: selectHousehold_selectHousehold_households[];
  selectedHousehold: selectHousehold_selectHousehold_selectedHousehold | null;
  invites: (selectHousehold_selectHousehold_invites | null)[] | null;
}

export interface selectHousehold {
  selectHousehold: selectHousehold_selectHousehold;
}

export interface selectHouseholdVariables {
  householdId: string;
}
