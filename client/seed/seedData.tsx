import gql from "graphql-tag";

const householdId = "cjui5ry8100270702azvhu548";

const AddUser = gql`
  mutation createUser {
    createUser(name: "Test", email: "test@hej.com") {
      id
    }
  }
`;

const AddUserToHousehold = gql`
  mutation AddUserToHousehold($userId: String!) {
    addUserToHousehold(userId: $userId, householdId: "") {
      id
    }
  }
`;

const CreateChore = gql`
  mutation createChore($choreInput: ChoreInput!) {
    createChore(input: $choreInput) {
      name
      id
    }
  }
`;
