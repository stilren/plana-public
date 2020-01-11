import * as React from "react";
import { IonItem, IonBadge, IonInput, IonButton, IonIcon } from "@ionic/react";
import {
  ChoreInput,
  RecurrenceType,
  TodoState,
  ChoreStatus
} from "../__generated__/globalTypes";
import gql from "graphql-tag";
import { withRouter, RouteComponentProps } from "react-router";
import { Mutation, MutationFn } from "react-apollo";
import { choreFragments } from "../sharedGraphql/choreFragments";
import {
  createChoreVariables,
  createChore,
  createChore_createChore
} from "../__generated__/createChore";
import { RefObject } from "react";
import { getChores, getChoresVariables } from "../__generated__/getChores";
import { GET_CHORES_QUERY } from "../pages/Upnext/Upnext";
import { add } from "ionicons/icons";

const ADD_CHORE = gql`
  mutation createChore($choreInput: ChoreInput!) {
    createChore(input: $choreInput) {
      ...ChoreInList
    }
  }
  ${choreFragments.choreInList}
`;

type State = {
  choreName: string | undefined | null;
  isEditing: Boolean;
};

type Props = RouteComponentProps & {};

const CreateChoreItem = class UpnextComponent extends React.Component<
  Props,
  State
> {
  ionInputRef: RefObject<HTMLIonInputElement>;
  constructor(props: Props) {
    super(props);
    this.state = {
      choreName: undefined,
      isEditing: false
    };
    this.ionInputRef = React.createRef();
  }

  render() {
    return this.state.isEditing ? (
      <IonItem lines="none">
        <IonBadge slot="start" color="secondary">
          0
        </IonBadge>
        <IonInput
          ref={this.ionInputRef}
          onIonBlur={() =>
            setTimeout(() => this.setState({ isEditing: false }), 300)
          }
          id="newChoreInput"
          onIonChange={e => this.setState({ choreName: e.detail.value })}
          value={this.state.choreName}
          placeholder="Namn"
          type="text"
        />
        <Mutation<createChore, createChoreVariables> mutation={ADD_CHORE}>
          {createChore => (
            <IonButton onClick={() => this.createChore(createChore)} slot="end">
              <IonIcon icon={add} />
            </IonButton>
          )}
        </Mutation>
      </IonItem>
    ) : (
      <IonItem onClick={() => this.swapToAddChore()} lines="none">
        <div
          className="ion-text-center"
          style={{
            color: "#104d4aw",
            width: "100%"
          }}
        >
          Lägg till uppgift
        </div>
      </IonItem>
    );
  }

  swapToAddChore() {
    this.setState({ isEditing: true, choreName: undefined }, () => {
      setTimeout(() => this.ionInputRef.current!.setFocus(), 300);
    });
  }

  createChore(cb: MutationFn<createChore, createChoreVariables>) {
    if (this.state.choreName == null || this.state.choreName == undefined)
      return;
    const choreInput: ChoreInput = {
      name: this.state.choreName,
      isUpnext: this.props.location.pathname.indexOf("upnext") > 0,
      recurrenceType:
        this.props.location.pathname.indexOf("recurring") > 0
          ? RecurrenceType.AUTOMATIC
          : RecurrenceType.MANUAL,
      todoState:
        this.props.location.pathname.indexOf("todo") > 0
          ? TodoState.DONE
          : TodoState.NOT_IN_TODO
    };

    const dummyChore: createChore_createChore = {
      __typename: "Chore",
      recurrenceType: choreInput.recurrenceType,
      recurringNextOccurence: null,
      recurringWeekCadence: null,
      name: this.state.choreName,
      id: Math.random().toString(),
      assignee: null,
      isUpnext: choreInput.isUpnext,
      effortRatings: [],
      todoState: null,
      lockedToUser: null
    };

    let choreStatus: ChoreStatus[];
    if (this.props.location.pathname.indexOf("upnext") > 0) {
      choreStatus = [ChoreStatus.UPNEXT];
    } else if (this.props.location.pathname.indexOf("todo") > 0) {
      choreStatus = [ChoreStatus.TODO, ChoreStatus.DONE];
    } else if (this.props.location.pathname.indexOf("recurring") > 0) {
      choreStatus = [ChoreStatus.RECURRING];
    } else {
      choreStatus = [ChoreStatus.ARCHIVE];
    }

    cb({
      variables: { choreInput: choreInput },
      optimisticResponse: { createChore: dummyChore },
      update: (proxy, { data }) => {
        const cachedData = proxy.readQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: choreStatus }
        });
        proxy.writeQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: choreStatus },
          data: { chores: [data!.createChore].concat(cachedData!.chores) }
        });
      }
    });

    this.setState({ choreName: undefined, isEditing: false });
  }
};

export default withRouter(CreateChoreItem);
