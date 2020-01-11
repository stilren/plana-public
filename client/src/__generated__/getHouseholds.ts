/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getHouseholds
// ====================================================

export interface getHouseholds_me_households_members {
  __typename: "User";
  name: string;
  id: string;
}

export interface getHouseholds_me_households_invites {
  __typename: "User";
  name: string;
  id: string;
  email: string | null;
}

export interface getHouseholds_me_households {
  __typename: "Household";
  members: getHouseholds_me_households_members[];
  id: string;
  name: string;
  invites: (getHouseholds_me_households_invites | null)[] | null;
}

export interface getHouseholds_me_selectedHousehold {
  __typename: "Household";
  id: string;
  name: string;
}

export interface getHouseholds_me_invites {
  __typename: "Household";
  name: string;
  id: string;
}

export interface getHouseholds_me {
  __typename: "User";
  households: getHouseholds_me_households[];
  selectedHousehold: getHouseholds_me_selectedHousehold | null;
  invites: (getHouseholds_me_invites | null)[] | null;
}

export interface getHouseholds {
  me: getHouseholds_me;
}
