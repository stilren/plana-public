import * as React from "react";
import {
  IonList,
  IonContent,
  IonItem,
  IonInput,
  IonBadge,
  IonRefresher,
  IonRefresherContent
} from "@ionic/react";
import "./Toolbar.css";
import SlidingChoreItem from "./SlidingChoreListItem";
import ChoreListItem from "./ChoreListItem";
import CreateChoreItem from "./CreateChoreItem";
import { getChores_chores } from "../__generated__/getChores";
import { ChoreStatus } from "../__generated__/globalTypes";
import { RefresherEventDetail } from "@ionic/core";

type Props = {
  chores: getChores_chores[];
  choreFilters: ChoreStatus[];
  refreshFunc: () => Promise<any>;
};

const ChoreList = class UpnextComponent extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <IonContent>
          <IonRefresher
            slot="fixed"
            onIonRefresh={e => this.refetch(e, this.props.refreshFunc)}
          >
            <IonRefresherContent />
          </IonRefresher>
          <IonList>
            <CreateChoreItem />
            {this.props.chores &&
              this.props.chores.map(
                chore =>
                  chore && (
                    <SlidingChoreItem
                      key={chore.id}
                      getChoreFilter={this.props.choreFilters}
                      chore={chore}
                    >
                      <ChoreListItem chore={chore} />
                    </SlidingChoreItem>
                  )
              )}
          </IonList>
        </IonContent>
      </React.Fragment>
    );
  }
  refetch(
    e: CustomEvent<RefresherEventDetail>,
    refreshFunc: () => Promise<any>
  ): void {
    refreshFunc().then(() => e.detail.complete());
  }
};

export default ChoreList;
