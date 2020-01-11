import React from "react";
import { IonModal } from "@ionic/react";
import {
  Query,
  Subscription,
  WithApolloClient,
  withApollo
} from "react-apollo";
import ChoreList from "../../components/ChoreList";
import { ChoreStatus } from "../../__generated__/globalTypes";
import { CHORE_SUBSCRIPTION, GET_CHORES_QUERY } from "../Upnext/Upnext";
import update from "immutability-helper";
import { getChoresVariables, getChores } from "../../__generated__/getChores";

type State = {};

const archiveComponent = class ArchiveComponent extends React.Component<
  WithApolloClient<Object>,
  State
> {
  constructor(props: WithApolloClient<Object>) {
    super(props);
  }

  render() {
    return (
      <>
        <Query<getChores, getChoresVariables>
          query={GET_CHORES_QUERY}
          variables={{ choreStatus: [ChoreStatus.ARCHIVE] }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, data, refetch }) => {
            if (loading && !data.chores) return <div>Loading Archive</div>;
            return (
              <>
                <ChoreList
                  refreshFunc={refetch}
                  choreFilters={[ChoreStatus.ARCHIVE]}
                  chores={data!.chores}
                />
              </>
            );
          }}
        </Query>
      </>
    );
  }
};
export const Archive = withApollo(archiveComponent);
