import * as React from "react";
import { Query, Mutation, MutationFn } from "react-apollo";
import gql from "graphql-tag";
import {
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonContent,
  IonPage,
  IonListHeader,
  IonIcon,
  IonButton,
  IonInput
} from "@ionic/react";
import { getHouseholds } from "../../__generated__/getHouseholds";
import {
  inviteToHousehold,
  inviteToHouseholdVariables
} from "../../__generated__/inviteToHousehold";
import {
  selectHousehold,
  selectHouseholdVariables
} from "../../__generated__/selectHousehold";
import {
  acceptInvite,
  acceptInviteVariables
} from "../../__generated__/acceptInvite";
import {
  deleteInvite,
  deleteInviteVariables
} from "../../__generated__/deleteInvite";
import { close, checkmark, pulse, add } from "ionicons/icons";

type Props = {};
type State = {
  inviteEmail: string;
};

export default class ManageHouseholds extends React.Component<Props, State> {
  public render() {
    return (
      <IonContent>
        <Query<getHouseholds> query={GET_HOUSEHOLDS}>
          {({ loading, data, error }) => {
            if (loading && !data.me) return <div></div>;
            const selectedHousehold = data.me.households.find(
              h => h.id === data.me.selectedHousehold.id
            );
            const { invites, members } = selectedHousehold;
            return (
              <IonList>
                <IonItem>
                  <a href="/addHousehold">Skapa nytt hushåll</a>
                </IonItem>
                <IonItem>
                  <IonLabel>Valt hushåll</IonLabel>
                  <Mutation<selectHousehold, selectHouseholdVariables>
                    mutation={SELECT_HOUSEHOLD}
                  >
                    {selectHousehold => (
                      <IonSelect
                        onIonChange={e => {
                          const chosenId = e.detail.value;
                          const householdToSelect = data.me.households.find(
                            h => h.id == chosenId
                          );
                          selectHousehold({
                            variables: {
                              householdId: chosenId
                            },
                            optimisticResponse: {
                              selectHousehold: {
                                ...data.me,
                                __typename: "User",
                                selectedHousehold: householdToSelect
                              }
                            },
                            update: (proxy, { data }) => {
                              proxy.writeQuery<getHouseholds, getHouseholds>({
                                query: GET_HOUSEHOLDS,
                                data: {
                                  me: data.selectHousehold
                                }
                              });
                            }
                          });
                        }}
                      >
                        {data.me.households.map(h => (
                          <IonSelectOption
                            selected={h.id === data.me.selectedHousehold.id}
                            key={h.id}
                            value={h.id}
                          >
                            {h.name}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    )}
                  </Mutation>
                </IonItem>
                <IonListHeader>
                  <IonLabel>Medlemmar i hushållet</IonLabel>
                </IonListHeader>
                {members.map(m => (
                  <IonItem>{m.name}</IonItem>
                ))}

                {invites.length > 0 && (
                  <>
                    <IonListHeader>
                      <IonLabel>Skickade hushållsinbjudningar</IonLabel>
                    </IonListHeader>

                    <Mutation<deleteInvite, deleteInviteVariables>
                      mutation={DELETE_INVITE}
                    >
                      {deleteInvite =>
                        invites.map(i => (
                          <IonItem key={i.id}>
                            {i.name}
                            <IonIcon
                              onClick={() =>
                                this.deleteInvite(i.email, deleteInvite, data)
                              }
                              slot="end"
                              icon={close}
                            />
                          </IonItem>
                        ))
                      }
                    </Mutation>
                  </>
                )}
                {data.me.invites.length > 0 && (
                  <>
                    <IonListHeader>
                      <IonLabel>Hushållsinbjudningar till dig</IonLabel>
                    </IonListHeader>
                    <Mutation<acceptInvite, acceptInviteVariables>
                      mutation={ACCEPT_INVITE}
                    >
                      {acceptInvite =>
                        data.me.invites.map(i => (
                          <IonItem key={i.id}>
                            {i.name}
                            <IonIcon
                              onClick={() =>
                                this.acceptInvite(
                                  i.name,
                                  i.id,
                                  acceptInvite,
                                  data
                                )
                              }
                              slot="end"
                              icon={checkmark}
                            />
                          </IonItem>
                        ))
                      }
                    </Mutation>
                  </>
                )}
                <IonListHeader>
                  <IonLabel>
                    Bjud in till {data.me.selectedHousehold.name}
                  </IonLabel>
                </IonListHeader>
                <IonItem lines="none">
                  <IonInput
                    id="newChoreInput"
                    onIonChange={e =>
                      this.setState({ inviteEmail: e.detail.value })
                    }
                    value={this.state.inviteEmail}
                    placeholder="Email"
                    type="text"
                  />
                  <Mutation<inviteToHousehold, inviteToHouseholdVariables>
                    mutation={INVITE_TO_HOUSEHOLD}
                  >
                    {inviteToHousehold => (
                      <IonIcon
                        slot="end"
                        onClick={() =>
                          this.inviteToHousehold(inviteToHousehold, data)
                        }
                        icon={add}
                      />
                    )}
                  </Mutation>
                </IonItem>
              </IonList>
            );
          }}
        </Query>
      </IonContent>
    );
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      inviteEmail: ""
    };
  }
  deleteInvite(
    email: string,
    deleteInvite: MutationFn<deleteInvite, deleteInviteVariables>,
    data: getHouseholds
  ): void {
    const selectedHousehold = data.me.households.find(
      h => h.id === data.me.selectedHousehold.id
    );

    selectedHousehold.invites = selectedHousehold.invites.filter(
      i => i.email !== email
    );

    deleteInvite({
      variables: { email: email },
      optimisticResponse: {
        deleteInvite: { ...data.me }
      },
      update: (proxy, { data }) => {
        proxy.writeQuery<getHouseholds, getHouseholds>({
          query: GET_HOUSEHOLDS,
          data: {
            me: data.deleteInvite
          }
        });
      }
    });
  }
  acceptInvite(
    name: string,
    id: string,
    acceptInvite: MutationFn<acceptInvite, acceptInviteVariables>,
    data: getHouseholds
  ) {
    acceptInvite({
      variables: { householdId: id },
      optimisticResponse: {
        addUserToHousehold: {
          ...data.me,
          households: data.me.households.concat({
            id: "123",
            name: name,
            __typename: "Household",
            invites: [],
            members: []
          }),
          invites: data.me.invites.filter(i => i.id !== id)
        }
      },
      update: (proxy, { data }) => {
        proxy.writeQuery<getHouseholds, getHouseholds>({
          query: GET_HOUSEHOLDS,
          data: {
            me: data.addUserToHousehold
          }
        });
      }
    });
  }
  inviteToHousehold(
    inviteToHousehold: MutationFn<
      inviteToHousehold,
      inviteToHouseholdVariables
    >,
    data: getHouseholds
  ): void {
    const selectedHousehold = data.me.households.find(
      h => h.id === data.me.selectedHousehold.id
    );

    if (
      selectedHousehold.invites.find(i => i.email !== this.state.inviteEmail)
    ) {
    }
    selectedHousehold.invites = selectedHousehold.invites.concat({
      __typename: "User",
      name: "",
      id: "",
      email: this.state.inviteEmail
    });

    inviteToHousehold({
      variables: {
        email: this.state.inviteEmail
      },
      optimisticResponse: {
        createInvite: {
          ...data.me,
          __typename: "User",
          selectedHousehold: selectedHousehold
        }
      },
      update: (proxy, { data }) => {
        proxy.writeQuery<getHouseholds, getHouseholds>({
          query: GET_HOUSEHOLDS,
          data: {
            me: data.createInvite
          }
        });
      }
    });
    this.setState({ inviteEmail: "" });
  }
}

const manageHousehold = gql`
  fragment ManageHousehold on User {
    households {
      members {
        name
        id
      }
      id
      name
      invites {
        name
        id
        email
      }
    }
    selectedHousehold {
      id
      name
    }
    invites {
      name
      id
    }
  }
`;

const GET_HOUSEHOLDS = gql`
  query getHouseholds {
    me {
      ...ManageHousehold
    }
  }
  ${manageHousehold}
`;

const SELECT_HOUSEHOLD = gql`
  mutation selectHousehold($householdId: String!) {
    selectHousehold(householdId: $householdId) {
      ...ManageHousehold
    }
  }
  ${manageHousehold}
`;

const INVITE_TO_HOUSEHOLD = gql`
  mutation inviteToHousehold($email: String!) {
    createInvite(email: $email) {
      ...ManageHousehold
    }
  }
  ${manageHousehold}
`;

const DELETE_INVITE = gql`
  mutation deleteInvite($email: String!) {
    deleteInvite(email: $email) {
      ...ManageHousehold
    }
  }
  ${manageHousehold}
`;

const ACCEPT_INVITE = gql`
  mutation acceptInvite($householdId: String!) {
    addUserToHousehold(householdId: $householdId) {
      ...ManageHousehold
    }
  }
  ${manageHousehold}
`;
