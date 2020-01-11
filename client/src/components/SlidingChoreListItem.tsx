import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn } from "react-apollo";
import {
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonActionSheet
} from "@ionic/react";
import {
  updateChoreUpnextStateVariables,
  updateChoreUpnextState
} from "../__generated__/updateChoreUpnextState";
import {
  getChores_chores,
  getChoresVariables,
  getChores
} from "../__generated__/getChores";
import { RecurrenceType, ChoreStatus } from "../__generated__/globalTypes";
import { GET_CHORES_QUERY } from "../pages/Upnext/Upnext";
import { choreFragments } from "../sharedGraphql/choreFragments";
import { getRecurringChoreNextDate } from "../utils/helpers";

const TOGGLE_ARCHIVE_UPNEXT = gql`
  mutation updateChoreUpnextState($isUpnext: Boolean!, $choreId: String!) {
    updateChoreUpnextState(choreId: $choreId, isUpnext: $isUpnext) {
      ...ChoreInList
    }
  }
  ${choreFragments.choreInList}
`;

type Props = {
  chore: getChores_chores;
  getChoreFilter: ChoreStatus[];
};

type State = {};

const SlidingChoreItemComponent = class SlidingChoreListItem extends React.Component<
  Props,
  State
> {
  ionItemSlidingRef: React.RefObject<HTMLIonItemSlidingElement>;
  constructor(props: Props) {
    super(props);
    this.ionItemSlidingRef = React.createRef();
  }
  render() {
    return (
      <div key={this.props.chore.id}>
        <Mutation<updateChoreUpnextState, updateChoreUpnextStateVariables>
          mutation={TOGGLE_ARCHIVE_UPNEXT}
          key={this.props.chore.id}
        >
          {togglePlanningState => (
            <IonItemSliding
              ref={this.ionItemSlidingRef}
              key={this.props.chore.id}
            >
              {this.props.children}
              <IonItemOptions side="end">
                <IonItemOption
                  expandable
                  onClick={() => {
                    this.togglePlanningState(togglePlanningState);
                  }}
                >
                  {this.getOptionText()}
                </IonItemOption>
              </IonItemOptions>
              {!this.props.chore.isUpnext && (
                <IonItemOptions side="start">
                  <IonItemOption
                    expandable
                    color="danger"
                    onClick={() => console.log("Delete")}
                  >
                    Ta bort
                  </IonItemOption>
                </IonItemOptions>
              )}
            </IonItemSliding>
          )}
        </Mutation>
      </div>
    );
  }
  getOptionText(): React.ReactNode {
    const { isUpnext, recurrenceType } = this.props.chore;
    if (isUpnext) {
      if (recurrenceType === "AUTOMATIC") return "Skjut upp";
      return "Till arkivet";
    }
    return "Till upnext";
  }
  togglePlanningState(
    cb: MutationFn<updateChoreUpnextState, updateChoreUpnextStateVariables>
  ) {
    let dummyChore = {
      ...this.props.chore,
      isUpnext: !this.props.chore.isUpnext
    };
    if (this.props.getChoreFilter.includes(ChoreStatus.RECURRING))
      dummyChore = {
        ...dummyChore,
        recurringNextOccurence: getRecurringChoreNextDate(this.props.chore)
      };
    cb({
      variables: {
        choreId: this.props.chore.id,
        isUpnext: !this.props.chore.isUpnext
      },
      update: (proxy, { data }) => {
        const cachedData = proxy.readQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: this.props.getChoreFilter }
        });
        let chores;
        if (this.props.getChoreFilter.includes(ChoreStatus.RECURRING)) {
          const newChore = data!.updateChoreUpnextState;
          chores = cachedData!.chores.map(c => {
            if (c.id === newChore.id) return newChore;
            return c;
          });
        } else {
          chores = cachedData!.chores.filter(
            c => c.id != data!.updateChoreUpnextState.id
          );
        }
        proxy.writeQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: this.props.getChoreFilter },
          data: { chores: [...chores] }
        });
      },
      optimisticResponse: { updateChoreUpnextState: dummyChore }
    });
  }
};
export default SlidingChoreItemComponent;
