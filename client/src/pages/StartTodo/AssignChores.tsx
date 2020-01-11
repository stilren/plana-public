import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import {
  Query,
  Mutation,
  MutationFn,
  withApollo,
  WithApolloClient
} from "react-apollo";
import {
  getChores,
  getChoresVariables,
  getChores_chores
} from "../../__generated__/getChores";
import { GET_CHORES_QUERY } from "../Upnext/Upnext";
import { ChoreStatus } from "../../__generated__/globalTypes";
import {
  assignment,
  assignmentVariables
} from "../../__generated__/assignment";
import gql from "graphql-tag";
import { choreFragments } from "../../sharedGraphql/choreFragments";
import { IonButton, IonList } from "@ionic/react";
import ChoreListItem from "../../components/ChoreListItem";
import { startTodo, startTodoVariables } from "../../__generated__/startTodo";

type Props = RouteComponentProps & {};
type State = {
  isAssigning: AssignmentState;
};

enum AssignmentState {
  NotAssigned,
  IsAssigning,
  DoneAssigning
}

const AssignChores = class StartTodo extends Component<
  WithApolloClient<Props>,
  State
> {
  constructor(props: WithApolloClient<Props>) {
    super(props);
    this.state = {
      isAssigning: AssignmentState.NotAssigned
    };
  }
  render() {
    return (
      <Query<getChores, getChoresVariables>
        query={GET_CHORES_QUERY}
        variables={{
          choreStatus: [ChoreStatus.UPNEXT]
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data }) => {
          if (loading) return <div />;
          return (
            <div>
              <Mutation<assignment, assignmentVariables>
                mutation={ASSIGN_CHORES}
              >
                {assignChores => (
                  <div>
                    <IonButton
                      onClick={() => {
                        if (
                          this.state.isAssigning ===
                          AssignmentState.DoneAssigning
                        ) {
                          this.props.history.push("/plan/todo");
                        } else {
                          this.onAssignmentClick(data.chores, assignChores);
                        }
                      }}
                      disabled={
                        this.state.isAssigning == AssignmentState.IsAssigning
                      }
                      expand="block"
                    >
                      {this.assignButtonTitle()}
                    </IonButton>
                  </div>
                )}
              </Mutation>
              ;
              <IonList>
                {data.chores.map(c => (
                  <ChoreListItem
                    key={c.id}
                    chore={c}
                    showAssignee={
                      this.state.isAssigning === AssignmentState.DoneAssigning
                    }
                  />
                ))}
              </IonList>
              ;
            </div>
          );
        }}
      </Query>
    );
  }
  assignButtonTitle = () => {
    if (this.state.isAssigning === AssignmentState.DoneAssigning) {
      return "Till \"Att göra-listan\"";
    } else if (this.state.isAssigning === AssignmentState.IsAssigning) {
      return "Delar ut uppgifter";
    } else {
      return "Dela ut uppgifter";
    }
  };
  onAssignmentClick = async (
    chores: getChores_chores[],
    assignChores: MutationFn<assignment, assignmentVariables>
  ) => {
    const choreIds = chores.map(c => c.id);
    this.setState(prevState => ({
      ...prevState,
      isAssigning: AssignmentState.IsAssigning
    }));
    await assignChores({
      variables: {
        choreIds: choreIds
      },
      update: (proxy, { data }) => {
        proxy.writeQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: [ChoreStatus.UPNEXT] },
          data: { chores: data.assignChores }
        });
      }
    });
    await this.props.client.mutate<startTodo, startTodoVariables>({
      mutation: START_TODO,
      variables: { choreIds: choreIds }
    });
    this.setState(prevState => ({
      ...prevState,
      isAssigning: AssignmentState.DoneAssigning
    }));
  };
};

const ASSIGN_CHORES = gql`
  mutation assignment($choreIds: [String!]!) {
    assignChores(choresIds: $choreIds) {
      ...ChoreInList
    }
  }
  ${choreFragments.choreInList}
`;

const START_TODO = gql`
  mutation startTodo($choreIds: [String!]!) {
    startTodo(choreIds: $choreIds)
  }
`;

export default withRouter(withApollo(AssignChores));
