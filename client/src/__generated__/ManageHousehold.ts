/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ManageHousehold
// ====================================================

export interface ManageHousehold_households_members {
  __typename: "User";
  name: string;
  id: string;
}

export interface ManageHousehold_households_invites {
  __typename: "User";
  name: string;
  id: string;
  email: string | null;
}

export interface ManageHousehold_households {
  __typename: "Household";
  members: ManageHousehold_households_members[];
  id: string;
  name: string;
  invites: (ManageHousehold_households_invites | null)[] | null;
}

export interface ManageHousehold_selectedHousehold {
  __typename: "Household";
  id: string;
  name: string;
}

export interface ManageHousehold_invites {
  __typename: "Household";
  name: string;
  id: string;
}

export interface ManageHousehold {
  __typename: "User";
  households: ManageHousehold_households[];
  selectedHousehold: ManageHousehold_selectedHousehold | null;
  invites: (ManageHousehold_invites | null)[] | null;
}
