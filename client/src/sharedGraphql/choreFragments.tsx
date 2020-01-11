import gql from "graphql-tag";
import { getChores_chores } from "../__generated__/getChores";

export const choreFragments = {
  choreInList: gql`
    fragment ChoreInList on Chore {
      name
      assignee {
        givenName
        name
      }
      id
      recurrenceType
      recurringWeekCadence
      recurringNextOccurence
      isUpnext
      effortRatings {
        effort
      }
      todoState
      lockedToUser {
        givenName
        name
      }
    }
  `,
  choreDetails: gql`
    fragment ChoreDetails on Chore {
      name
      id
      description
      effortRatings {
        id
        user {
          id
          givenName
          name
        }
        effort
      }
      household {
        id
        members {
          id
          name
          givenName
        }
        name
      }
      assignee {
        id
      }
      todoState
      isUpnext
      recurrenceType
      recurringWeekCadence
      recurringNextOccurence
      recurringLastOccurence
      lockedToUser {
        id
        name
        givenName
      }
    }
  `
};
