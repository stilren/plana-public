import {
  getChores_chores,
  getChores,
  getChoresVariables
} from "../__generated__/getChores";
import ApolloClient from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { GET_CHORES_QUERY } from "../pages/Upnext/Upnext";
import { ChoreStatus } from "../__generated__/globalTypes";
import { GET_TODOS } from "../pages/Todo/Todo";

export function getRecurringChoreNextDate(c: getChores_chores): string {
  let nextDate = new Date(c.recurringNextOccurence);
  nextDate.setDate(nextDate.getDate() + c.recurringWeekCadence! * 7);
  return nextDate.toISOString();
}

export function warmCache(client: ApolloClient<NormalizedCacheObject>) {
  try {
    //Check all queries we want to preload
    client.readQuery<getChores, getChoresVariables>({
      query: GET_CHORES_QUERY,
      variables: { choreStatus: [ChoreStatus.UPNEXT] }
    });
    client.readQuery<getChores, getChoresVariables>({
      query: GET_CHORES_QUERY,
      variables: { choreStatus: [ChoreStatus.ARCHIVE] }
    });
    client.readQuery<getChores, getChoresVariables>({
      query: GET_CHORES_QUERY,
      variables: { choreStatus: [ChoreStatus.TODO, ChoreStatus.DONE] }
    });
    client.readQuery<getChores, getChoresVariables>({
      query: GET_CHORES_QUERY,
      variables: { choreStatus: [ChoreStatus.RECURRING] }
    });
  } catch (err) {
    if (!this.state.showLoading) {
      this.setState({ showLoading: true });
      const promises = [
        client.query<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: [ChoreStatus.UPNEXT] }
        }),
        client.query<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: [ChoreStatus.ARCHIVE] }
        }),
        client.query<getChores, getChoresVariables>({
          query: GET_TODOS,
          variables: { choreStatus: [ChoreStatus.TODO, ChoreStatus.DONE] }
        }),
        client.query<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: [ChoreStatus.RECURRING] }
        })
      ];
      Promise.all(promises)
        .then(() => {
          this.setState({ showLoading: false });
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ showLoading: false });
        });
    }
  }
}
