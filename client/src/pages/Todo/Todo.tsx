import React, { RefObject } from "react";
import gql from "graphql-tag";
import { getTodos } from "../../__generated__/getTodos";
import { Query, Mutation, MutationFn } from "react-apollo";
import { TodoState } from "../../__generated__/globalTypes";
import {
  setTodoState,
  setTodoStateVariables
} from "../../__generated__/setTodoState";
import ChoreListItem from "../../components/ChoreListItem";
import { choreFragments } from "../../sharedGraphql/choreFragments";
import CompactChoreListItem from "../../components/CompactChoreListItem";
import { IonList, IonListHeader, IonLabel } from "@ionic/react";

const Todofragment = gql`
  fragment TodoInList on Chore {
    id
    household {
      name
    }
    name
    assignee {
      name
      givenName
    }
    effortRatings {
      effort
    }
    todoState
  }
`;

export const GET_TODOS = gql`
  query getTodos {
    chores(filter: { status: [TODO, DONE] }) {
      ...ChoreInList
    }
  }
  ${choreFragments.choreInList}
`;

export const SET_TODO = gql`
  mutation setTodoState($choreId: ID!, $todoState: TodoState!) {
    setTodoState(choreId: $choreId, state: $todoState) {
      ...ChoreInList
    }
  }
  ${choreFragments.choreInList}
`;

const Todo = class Todo extends React.Component<{}, {}> {
  setTodo(
    done: Boolean,
    callback: MutationFn<setTodoState, setTodoStateVariables>
  ) {}
  render() {
    return (
      <>
        <Query<getTodos> query={GET_TODOS} fetchPolicy="cache-and-network">
          {({ data, loading, refetch }) => {
            if (loading && !data.chores) return <div>Loading Todo</div>;
            return (
              <>
                <Mutation<setTodoState, setTodoStateVariables>
                  mutation={SET_TODO}
                >
                  {setTodoState => {
                    return (
                      <>
                        <IonList>
                          <IonListHeader>
                            <IonLabel>Todo</IonLabel>
                          </IonListHeader>
                          {data!.chores
                            .filter(c => c.todoState == TodoState.TODO)
                            .map(c => (
                              <CompactChoreListItem
                                onClick={() =>
                                  setTodoState({
                                    variables: {
                                      choreId: c.id,
                                      todoState: TodoState.DONE
                                    },
                                    optimisticResponse: {
                                      setTodoState: {
                                        ...c,
                                        todoState: TodoState.DONE
                                      }
                                    }
                                  })
                                }
                                key={c.id}
                                chore={c}
                                showAssignee={true}
                              />
                            ))}
                        </IonList>
                        <IonList>
                          <IonListHeader>
                            <IonLabel>Done</IonLabel>
                          </IonListHeader>
                          {data!.chores
                            .filter(c => c.todoState == TodoState.DONE)
                            .map(c => (
                              <CompactChoreListItem
                                onClick={() =>
                                  setTodoState({
                                    variables: {
                                      choreId: c.id,
                                      todoState: TodoState.TODO
                                    },
                                    optimisticResponse: {
                                      setTodoState: {
                                        ...c,
                                        todoState: TodoState.TODO
                                      }
                                    }
                                  })
                                }
                                faded={true}
                                key={c.id}
                                chore={c}
                                showAssignee={true}
                              />
                            ))}
                        </IonList>
                      </>
                    );
                  }}
                </Mutation>
              </>
            );
          }}
        </Query>
      </>
    );
  }
};

export default Todo;
