import React from "react";
import { IonIcon, IonFab, IonFabButton, IonContent } from "@ionic/react";
import gql from "graphql-tag";
import {
  Query,
  Subscription,
  withApollo,
  WithApolloClient
} from "react-apollo";
import "./Upnext.css";
import ChoreList from "../../components/ChoreList";
import { getChores, getChoresVariables } from "../../__generated__/getChores";
import { ChoreStatus } from "../../__generated__/globalTypes";
import { choreFragments } from "../../sharedGraphql/choreFragments";
import { checkmark, rocket } from "ionicons/icons";
import { RouteComponentProps, withRouter } from "react-router";

type State = {
  showActionSheet: boolean;
};

export const GET_CHORES_QUERY = gql`
  query getChores($choreStatus: [ChoreStatus]) {
    chores(filter: { status: $choreStatus }) {
      ...ChoreInList
    }
  }
  ${choreFragments.choreInList}
`;
export const CHORE_SUBSCRIPTION = gql`
  subscription choreSub {
    choreChanges(filter: { status: [UPNEXT, ARCHIVE] }) {
      node {
        name
      }
    }
  }
`;

type Props = RouteComponentProps<{}>;

const upnextComponent = class UpnextComponent extends React.Component<
  WithApolloClient<Props>,
  State
> {
  constructor(props: WithApolloClient<Props>) {
    super(props);
    this.state = {
      showActionSheet: false
    };
  }
  showAddModal = () => {
    this.setState(() => ({
      showAddModal: true,
      showActionSheet: false
    }));
  };

  turnActionSheetOn = async () => {
    this.setState(() => ({
      showActionSheet: true
    }));
  };

  turnActionSheetOff = () => {
    this.setState(() => ({
      showActionSheet: false
    }));
  };

  render() {
    return (
      <>
        <IonContent>
          <Query<getChores, getChoresVariables>
            query={GET_CHORES_QUERY}
            variables={{ choreStatus: [ChoreStatus.UPNEXT] }}
            fetchPolicy="cache-and-network"
          >
            {({ loading, data, refetch }) => {
              if (loading && !data.chores) return <div>Loading Upnext</div>;
              return (
                <>
                  <ChoreList
                    refreshFunc={refetch}
                    choreFilters={[ChoreStatus.UPNEXT]}
                    chores={data!.chores}
                  />
                </>
              );
            }}
          </Query>
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton
              onClick={() => this.props.history.push("/start/todo")}
            >
              <IonIcon icon={rocket} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </>
    );
  }
};

export const Upnext = withRouter(withApollo(upnextComponent));
