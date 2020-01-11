import React, { Children } from "react";
import {
  IonContent,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonInput,
  IonHeader,
  IonModal,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonToggle,
  IonTextarea,
  IonDatetime,
  IonList,
  IonText,
  IonSelect,
  IonSelectOption
} from "@ionic/react";
import gql from "graphql-tag";
import { Query, Mutation, MutationFn } from "react-apollo";
import {
  getChore,
  getChoreVariables,
  getChore_chore,
  getChore_chore_household_members,
  getChore_chore_effortRatings
} from "../../__generated__/getChore";
import { ChoreInput, RecurrenceType } from "../../__generated__/globalTypes";
import { withRouter, RouteComponentProps } from "react-router";
import "./ChoreDetails.css";
import Equal from "deep-equal";
import { choreFragments } from "../../sharedGraphql/choreFragments";
import {
  updateChore,
  updateChoreVariables
} from "../../__generated__/updateChore";
import EffortRatingPicker from "../../components/EffortRatingPicker";
import VotingCard from "../../components/VotingCard";
import { pin, lock } from "ionicons/icons";
import {
  LockChoreToUserVariables,
  LockChoreToUser
} from "../../__generated__/LockChoreToUser";

type State = {
  choreIsLoaded: boolean;
  input?: ChoreInput;
  oldInput?: ChoreInput;
  disabled: boolean;
  showModal: boolean;
  isEditing?: ChoreProperties;
  effortVariables: EffortVariables | null;
};

enum ChoreProperties {
  None,
  Name,
  Description,
  Recurrence,
  Effort,
  LockedToUser
}

type EffortVariables = {
  user: getChore_chore_household_members;
  effort: number;
  effortId: string | null;
};

type Props = RouteComponentProps<RouteParams> & {};

type RouteParams = { choreId: string };

const ChoreDetails = class ChoreDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: true,
      showModal: false,
      choreIsLoaded: false,
      effortVariables: null
    };
  }
  render() {
    return (
      <>
        <Query<getChore, getChoreVariables>
          query={CHORE_DETAIL}
          variables={{ choreId: this.props.match.params.choreId }}
          onCompleted={res => {
            const choreInput = this.toChoreInput(res.chore!);
            if (!Equal(choreInput, this.state.input))
              this.setState({ input: choreInput });
          }}
          fetchPolicy="cache-and-network"
        >
          {({ data, loading }) => {
            if (loading)
              return (
                <IonHeader>
                  <IonToolbar color="primary">
                    <IonButtons slot="start">
                      <IonBackButton
                        onClick={() => {
                          this.props.history.goBack();
                        }}
                        defaultHref="/"
                      />
                    </IonButtons>
                  </IonToolbar>
                  <IonToolbar color="primary">
                    <IonText>
                      <h1> </h1>
                    </IonText>
                  </IonToolbar>
                </IonHeader>
              );
            const chore = data!.chore!;
            return (
              <>
                <IonHeader>
                  <IonToolbar color="primary">
                    <IonButtons slot="start">
                      <IonBackButton
                        onClick={() => {
                          this.props.history.goBack();
                        }}
                        defaultHref="/"
                      />
                    </IonButtons>
                  </IonToolbar>
                  <IonToolbar color="primary">
                    <IonText
                      onClick={() =>
                        this.setState({
                          showModal: true,
                          isEditing: ChoreProperties.Name
                        })
                      }
                    >
                      <h1>{chore.name}</h1>
                    </IonText>
                    <div>I hushåll {chore.household.name}</div>
                  </IonToolbar>
                </IonHeader>
                <IonContent>
                  <IonList lines="none">
                    <IonItem
                      onClick={() =>
                        this.setState({
                          showModal: true,
                          isEditing: ChoreProperties.Description
                        })
                      }
                    >
                      <IonIcon icon={lock} slot="start" />
                      <IonLabel position="floating">Beskrivning</IonLabel>
                      <IonText>
                        <p>
                          {chore.description
                            ? chore.description
                            : "Lägg till beskrivning"}
                        </p>
                      </IonText>
                    </IonItem>

                    <IonItem
                      onClick={() =>
                        this.setState({
                          showModal: true,
                          isEditing: ChoreProperties.Recurrence
                        })
                      }
                    >
                      <IonIcon icon={lock} slot="start" />
                      <IonLabel position="floating">
                        {chore.recurrenceType === RecurrenceType.AUTOMATIC
                          ? "Schemalagd"
                          : "Ej schemalagd"}
                      </IonLabel>
                      <IonText>
                        <p>
                          {chore.recurrenceType === RecurrenceType.AUTOMATIC &&
                            this.recurrenceText(chore)}
                        </p>
                      </IonText>
                    </IonItem>
                    <Mutation<LockChoreToUser, LockChoreToUserVariables>
                      mutation={LOCK_CHORE_TO_USER}
                    >
                      {lockChore => (
                        <IonItem>
                          <IonIcon icon={lock} slot="start" />
                          <IonLabel>Lås till</IonLabel>
                          <IonSelect
                            onIonChange={e => {
                              const chosenId = e.detail.value;
                              const userToLockTo = chore.household.members.find(
                                u => u.id == chosenId
                              );
                              lockChore({
                                variables: {
                                  input: {
                                    choreId: chore.id,
                                    userId: chosenId,
                                    locked: chosenId !== ""
                                  }
                                },
                                optimisticResponse: {
                                  lockChoreToUser: {
                                    ...chore,
                                    lockedToUser: userToLockTo
                                  }
                                }
                              });
                            }}
                          >
                            <IonSelectOption
                              value=""
                              selected={!chore.lockedToUser}
                            >
                              Ingen
                            </IonSelectOption>
                            {chore.household.members.map(u => (
                              <IonSelectOption
                                key={u.id}
                                value={u.id}
                                selected={
                                  chore.lockedToUser &&
                                  u.id == chore.lockedToUser.id
                                }
                              >
                                {u.name}
                              </IonSelectOption>
                            ))}
                          </IonSelect>
                        </IonItem>
                      )}
                    </Mutation>

                    <IonItem>
                      <IonIcon icon={lock} slot="start" />
                      <IonLabel position="floating">Hur jobbigt?</IonLabel>
                      <IonText>
                        {chore.household.members.map(m => {
                          const userEffortRating = chore.effortRatings.find(
                            e => e.user.id === m.id
                          );
                          return (
                            <p
                              onClick={() =>
                                this.setState({
                                  showModal: true,
                                  isEditing: ChoreProperties.Effort,
                                  effortVariables: {
                                    user: m,
                                    effort: userEffortRating
                                      ? userEffortRating.effort
                                      : 0,
                                    effortId: userEffortRating
                                      ? userEffortRating.id
                                      : null
                                  }
                                })
                              }
                            >
                              {m.name} :{" "}
                              {userEffortRating ? userEffortRating.effort : 0}
                            </p>
                          );
                        })}
                      </IonText>
                    </IonItem>
                  </IonList>
                  <Mutation<updateChore, updateChoreVariables>
                    mutation={UPDATE_CHORE}
                  >
                    {updateChore => (
                      <IonModal
                        showBackdrop={true}
                        onDidDismiss={() =>
                          this.setState({
                            showModal: false,
                            isEditing: ChoreProperties.None,
                            input: { ...this.state.oldInput! }
                          })
                        }
                        onIonModalWillPresent={() =>
                          this.setState({
                            oldInput: { ...this.state.input! }
                          })
                        }
                        isOpen={this.state.showModal}
                        cssClass="my-custom-modal-css"
                      >
                        <IonHeader>
                          <IonToolbar>
                            <IonButtons slot="secondary">
                              <IonButton
                                onClick={() =>
                                  this.setState({ showModal: false })
                                }
                              >
                                Avbryt
                              </IonButton>
                              <IonButton
                                onClick={() => {
                                  this.updateChore(updateChore, chore);
                                }}
                              >
                                Spara
                              </IonButton>
                            </IonButtons>
                            <IonTitle>Ändra {this.propertyName()}</IonTitle>
                          </IonToolbar>
                        </IonHeader>
                        <IonContent>
                          <IonList lines="none">
                            {this.propertyEditor()}
                          </IonList>
                        </IonContent>
                      </IonModal>
                    )}
                  </Mutation>
                </IonContent>
              </>
            );
          }}
        </Query>
      </>
    );
  }
  updateChore(
    updateChore: MutationFn<updateChore, updateChoreVariables>,
    chore: getChore_chore
  ) {
    this.setState({
      showModal: false,
      oldInput: { ...this.state.input! } //Updateing stored input
    });
    updateChore({
      variables: {
        choreId: chore.id,
        choreInput: this.state.input!
      },
      optimisticResponse: {
        updateChore: this.toChore(this.state.input!, chore)
      }
    });
  }
  recurrenceText(chore: getChore_chore): React.ReactNode {
    const nextOcurrence = chore.recurringNextOccurence.substring(0, 10);
    if (chore.recurringWeekCadence === null || chore.recurringWeekCadence === 0)
      return `Inträffar ${nextOcurrence}`;
    return `Var ${chore.recurringWeekCadence} vecka, nästa tillfälle ${nextOcurrence}`;
  }
  propertyEditor(): React.ReactNode {
    switch (this.state.isEditing) {
      case ChoreProperties.Name:
        return (
          <IonItem>
            <IonLabel position="floating">Nytt namn</IonLabel>
            <IonInput
              onIonChange={event =>
                this.setState(prevState => ({
                  input: { ...prevState.input!, name: event.detail.value! }
                }))
              }
              value={this.state.input!.name}
            />
          </IonItem>
        );
      case ChoreProperties.Description:
        return (
          <IonItem>
            <IonLabel position="floating">Ny beskrivning</IonLabel>
            <IonTextarea
              onIonChange={event =>
                this.setState(prevState => ({
                  input: {
                    ...prevState.input!,
                    description: event.detail.value!
                  }
                }))
              }
              value={this.state.input!.description}
            />
          </IonItem>
        );
      case ChoreProperties.Recurrence:
        return (
          <>
            <IonItem>
              <IonLabel>
                {this.state.input!.recurrenceType === RecurrenceType.AUTOMATIC
                  ? "Återkommer automatiskt"
                  : "Återkommer ej automatiskt"}
              </IonLabel>
              <IonToggle
                checked={
                  this.state.input!.recurrenceType === RecurrenceType.AUTOMATIC
                }
                onIonChange={() => {
                  const recurrenceType =
                    this.state.input!.recurrenceType ===
                    RecurrenceType.AUTOMATIC
                      ? RecurrenceType.MANUAL
                      : RecurrenceType.AUTOMATIC;
                  this.setState({
                    input: {
                      ...this.state.input!,
                      recurrenceType: recurrenceType
                    }
                  });
                }}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Första tillfället</IonLabel>
              <IonDatetime
                disabled={
                  this.state.input!.recurrenceType !== RecurrenceType.AUTOMATIC
                }
                onIonChange={event =>
                  this.setState(prevState => ({
                    input: {
                      ...prevState.input!,
                      recurrenceInput: {
                        ...prevState.input!.recurrenceInput!,
                        nextOccurence: event.detail.value!
                      }
                    }
                  }))
                }
                value={this.state.input!.recurrenceInput!.nextOccurence}
                displayFormat="DDD DD MMM YY"
                dayShortNames={[
                  "sön",
                  "mån",
                  "tis",
                  "ons",
                  "tor",
                  "fre",
                  "lör"
                ]}
                monthShortNames="jan, feb, mar, apr, maj, jun, jul, aug, sep, okt, nov, dec"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">
                Hur många veckor mellan varje tillfälle?
              </IonLabel>
              <IonInput
                disabled={
                  this.state.input!.recurrenceType !== RecurrenceType.AUTOMATIC
                }
                type="number"
                min="1"
                onIonChange={event =>
                  this.setState(prevState => ({
                    input: {
                      ...prevState.input!,
                      recurrenceInput: {
                        ...prevState.input!.recurrenceInput!,
                        weekCadence: parseInt(event.detail.value!)
                      }
                    }
                  }))
                }
                value={`${
                  this.state.input!.recurrenceInput
                    ? this.state.input!.recurrenceInput!.weekCadence
                    : "0"
                }`}
              />
            </IonItem>
          </>
        );
      case ChoreProperties.Effort:
        return (
          <IonItem>
            <EffortRatingPicker
              onChange={this.setEffortState.bind(this)}
              value={
                this.state.input!.effort
                  ? this.state.input!.effort!.effort
                  : this.state.effortVariables!.effort
              }
            />
          </IonItem>
        );
      case ChoreProperties.LockedToUser:
        return <IonItem>Hej</IonItem>;
      default:
        return <div />;
    }
  }
  setEffortState(effort: number) {
    this.setState(prevState => ({
      input: {
        ...prevState.input!,
        effort: {
          effort: effort,
          userId: this.state.effortVariables!.user.id,
          effortId: this.state.effortVariables!.effortId
        }
      }
    }));
  }
  toChoreInput(chore: getChore_chore): ChoreInput {
    return {
      assignee: chore.assignee ? chore.assignee.id : null,
      description: chore.description,
      isUpnext: chore.isUpnext,
      name: chore.name,
      recurrenceInput: {
        nextOccurence: chore.recurringNextOccurence,
        weekCadence: chore.recurringWeekCadence
      },
      todoState: chore.todoState,
      recurrenceType: chore.recurrenceType
    };
  }
  toChore(
    choreInput: ChoreInput,
    originalChore: getChore_chore
  ): getChore_chore {
    const chore: getChore_chore = {
      ...originalChore,
      name: choreInput.name,
      description:
        choreInput.description == undefined ? null : choreInput.description,
      recurrenceType: choreInput.recurrenceType
    };
    if (chore.recurrenceType === RecurrenceType.AUTOMATIC) {
      chore.recurringNextOccurence = choreInput.recurrenceInput!.nextOccurence;
      chore.recurringWeekCadence = choreInput.recurrenceInput!.weekCadence!;
    }
    if (choreInput.effort) {
      const existingEffortRating = chore.effortRatings.find(
        e => e.user.id == choreInput.effort!.userId
      );
      const user = chore.household.members.find(
        m => m.id == choreInput.effort!.userId
      );
      const dummyEffortRating: getChore_chore_effortRatings = {
        __typename: "EffortRating",
        effort: choreInput.effort!.effort,
        user: user!,
        id: existingEffortRating ? existingEffortRating.id : user!.name
      };
      if (existingEffortRating) {
        chore.effortRatings = chore.effortRatings.map(e => {
          if (e.id == existingEffortRating.id) return dummyEffortRating;
          return e;
        });
      } else {
        chore.effortRatings = chore.effortRatings.concat([dummyEffortRating]);
      }
    }
    return chore;
  }
  propertyName(): string {
    switch (this.state.isEditing) {
      case ChoreProperties.Name:
        return "namn";
      case ChoreProperties.Description:
        return "beskrivning";
      case ChoreProperties.Recurrence:
        return "schemaläggning";
      default:
        return "";
    }
  }
};
const UPDATE_CHORE = gql`
  mutation updateChore($choreId: ID!, $choreInput: ChoreInput!) {
    updateChore(choreId: $choreId, input: $choreInput) {
      ...ChoreDetails
    }
  }
  ${choreFragments.choreDetails}
`;

const CHORE_DETAIL = gql`
  query getChore($choreId: ID!) {
    chore(id: $choreId) {
      ...ChoreDetails
    }
  }
  ${choreFragments.choreDetails}
`;

const LOCK_CHORE_TO_USER = gql`
  mutation LockChoreToUser($input: LockedToUserInput!) {
    lockChoreToUser(input: $input) {
      ...ChoreDetails
    }
  }
  ${choreFragments.choreDetails}
`;

const ChoreDetailsWithRouter = withRouter(ChoreDetails);
export default ChoreDetailsWithRouter;
