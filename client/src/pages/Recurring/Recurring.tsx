import React from "react";
import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { Query } from "react-apollo";
import { GET_CHORES_QUERY } from "../Upnext/Upnext";
import { ChoreStatus } from "../../__generated__/globalTypes";
import { getChores, getChoresVariables } from "../../__generated__/getChores";
import CreateChoreItem from "../../components/CreateChoreItem";
import ChoreListItem from "../../components/ChoreListItem";
import SlidingChoreItemComponent from "../../components/SlidingChoreListItem";

function doRefresh(event: CustomEvent<RefresherEventDetail>, cb: any) {
  cb().then(() => event.detail.complete());
}
const recurring = class RecurringComponent extends React.Component<{}, {}> {
  render() {
    return (
      <Query<getChores, getChoresVariables>
        query={GET_CHORES_QUERY}
        variables={{ choreStatus: [ChoreStatus.RECURRING] }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, data, refetch }) => {
          if (loading && !data.chores) return <div>Loading Recurring</div>;
          return (
            <IonContent>
              <IonRefresher
                slot="fixed"
                onIonRefresh={e => doRefresh(e, refetch)}
              >
                <IonRefresherContent />
              </IonRefresher>
              <IonList>
                {data!.chores.map(c => (
                  <SlidingChoreItemComponent
                    getChoreFilter={[ChoreStatus.RECURRING]}
                    key={c.id}
                    chore={c}
                  >
                    <ChoreListItem chore={c} />
                  </SlidingChoreItemComponent>
                ))}
              </IonList>
            </IonContent>
          );
        }}
      </Query>
    );
  }
};
export default recurring;
