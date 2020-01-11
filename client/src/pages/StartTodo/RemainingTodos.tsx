import React, { Component } from "react";
import { Query, Mutation, MutationFn, OperationVariables } from "react-apollo";
import {
  getChores,
  getChoresVariables,
  getChores_chores
} from "../../__generated__/getChores";
import { GET_CHORES_QUERY } from "../Upnext/Upnext";
import { ChoreStatus, TodoState } from "../../__generated__/globalTypes";
import { withRouter, RouteComponentProps } from "react-router";
import {
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon
} from "@ionic/react";
import { moveChoresFromTodoToUpnext } from "../../__generated__/moveChoresFromTodoToUpnext";
import {
  setTodoStateBatch,
  setTodoStateBatchVariables
} from "../../__generated__/setTodoStateBatch";
import {
  setTodoState,
  setTodoStateVariables
} from "../../__generated__/setTodoState";
import { SET_TODO } from "../Todo/Todo";
import { checkmark } from "ionicons/icons";
import { choreFragments } from "../../sharedGraphql/choreFragments";
import gql from "graphql-tag";

type Props = RouteComponentProps & {};

const RemainingTodos = class StartTodo extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <Query<getChores, getChoresVariables>
        query={GET_CHORES_QUERY}
        variables={{
          choreStatus: [ChoreStatus.TODO]
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data }) => {
          if (loading) return <div />;
          if (!data || data.chores.length === 0) {
            if (this.props.location.pathname.indexOf("start/todo") > 0) {
              //This if is needed cause otherwise the change in props from pushing a new history object will trigger a rerender (since all tabs are rendered) and thus an infinite loop occurs
              this.props.history.push("/start/vote");
            }
            return <div />;
          }
          return (
            <IonContent>
              <h1 className="slide-title">
                Dessa är fortfarande inte gjorda. Vad ska vi göra med dom?
              </h1>
              <Mutation<moveChoresFromTodoToUpnext>
                mutation={MOVE_CHORES_FROM_TODO_TO_UPNEXT}
              >
                {moveChores => (
                  <IonButton
                    onClick={() => {
                      this.updateUpnextQuery(moveChores, data.chores);
                    }}
                    fill="solid"
                  >
                    Ta med i nästa todo
                  </IonButton>
                )}
              </Mutation>

              <Mutation<setTodoStateBatch, setTodoStateBatchVariables>
                mutation={SET_TODO_STATE_BATCH}
              >
                {setTodos => {
                  return (
                    <IonButton
                      onClick={() => {
                        setTodos({
                          variables: {
                            choreIds: data.chores.map(c => c.id),
                            state: TodoState.DONE
                          }
                        });
                        this.props.history.push("/start/vote");
                      }}
                      fill="solid"
                    >
                      Markera som klara
                    </IonButton>
                  );
                }}
              </Mutation>
              <IonList>
                {data.chores.map(c => (
                  <IonItem key={c.id}>
                    <IonLabel>{c.name}</IonLabel>
                    <Mutation<setTodoState, setTodoStateVariables>
                      mutation={SET_TODO}
                    >
                      {setTodoState => {
                        return (
                          <IonIcon
                            onClick={() => {
                              this.updateTodoQuery(setTodoState, c);
                            }}
                            icon={checkmark}
                          />
                        );
                      }}
                    </Mutation>
                  </IonItem>
                ))}
              </IonList>
            </IonContent>
          );
        }}
      </Query>
    );
  }
  updateTodoQuery(
    setTodoState: MutationFn<setTodoState, setTodoStateVariables>,
    c: getChores_chores
  ) {
    setTodoState({
      variables: {
        choreId: c.id,
        todoState: TodoState.DONE
      },
      optimisticResponse: {
        setTodoState: {
          ...c,
          __typename: "Chore",
          todoState: TodoState.DONE
        }
      },
      update: (proxy, { data }) => {
        const cachedData = proxy.readQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: {
            choreStatus: [ChoreStatus.TODO]
          }
        });
        proxy.writeQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: {
            choreStatus: [ChoreStatus.TODO]
          },
          data: {
            chores: cachedData.chores.filter(c => c.id !== data.setTodoState.id)
          }
        });
      }
    });
  }
  updateUpnextQuery(
    moveChores: MutationFn<moveChoresFromTodoToUpnext, OperationVariables>,
    chores: getChores_chores[]
  ) {
    moveChores({
      optimisticResponse: {
        moveChoresFromTodoToUpnext: [
          ...chores.map(c => {
            c.isUpnext = true;
            return c;
          })
        ]
      },
      update: (proxy, { data }) => {
        const cachedData = proxy.readQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: {
            choreStatus: [ChoreStatus.UPNEXT]
          }
        });
        const newChores = cachedData!.chores.map(c => {
          const choreFromData = data.moveChoresFromTodoToUpnext.find(
            ch => ch.id === c.id
          );
          if (choreFromData !== null) {
            return choreFromData;
          }
          return c;
        });
        proxy.writeQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: {
            choreStatus: [ChoreStatus.UPNEXT]
          },
          data: {
            chores: newChores
          }
        });
      }
    });
    this.props.history.push("/start/vote");
  }
};

export const MOVE_CHORES_FROM_TODO_TO_UPNEXT = gql`
  mutation moveChoresFromTodoToUpnext {
    moveChoresFromTodoToUpnext {
      ...ChoreInList
    }
  }
  ${choreFragments.choreInList}
`;

export const SET_TODO_STATE_BATCH = gql`
  mutation setTodoStateBatch($choreIds: [ID!]!, $state: TodoState!) {
    setTodoStateBatch(choreIds: $choreIds, state: $state) {
      ...ChoreInList
    }
  }
  ${choreFragments.choreInList}
`;

export default withRouter(RemainingTodos);
