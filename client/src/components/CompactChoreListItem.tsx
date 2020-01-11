import * as React from "react";
import { IonItem, IonBadge, IonLabel, IonIcon } from "@ionic/react";
import { withRouter, RouteComponentProps } from "react-router";
import { getChores_chores } from "../__generated__/getChores";
import { RecurrenceType } from "../__generated__/globalTypes";
import { lock, infinite } from "ionicons/icons";

type Props = {
  chore: getChores_chores;
  showAssignee?: boolean;
  onClick: () => void;
  faded?: boolean;
};

const fadedStyle = {
  opacity: "0.5"
};

const CompactChoreListItem = class CompactChoreListItem extends React.Component<
  Props
> {
  render() {
    return (
      <IonItem
        style={this.props.faded ? fadedStyle : {}}
        onClick={this.props.onClick}
        lines="none"
      >
        <IonBadge slot="start" color="secondary">
          {this.choreEffort(this.props.chore)}
        </IonBadge>
        <IonLabel>
          <h2>{this.props.chore.name}</h2>
          <h3>{this.choreAssignee(this.props.chore)}</h3>
        </IonLabel>
        {this.props.chore.lockedToUser && <IonIcon icon={lock} />}
        {this.props.chore.recurrenceType === RecurrenceType.AUTOMATIC && (
          <IonIcon icon={infinite} />
        )}
        <IonIcon slot="end" name="arrow-dropright" />
      </IonItem>
    );
  }
  choreAssignee(chore: getChores_chores): React.ReactNode {
    if (this.props.showAssignee) {
      return chore.assignee
        ? chore.assignee.givenName
          ? chore.assignee.givenName
          : chore.assignee.name
        : null;
    }
    return "";
  }
  choreEffort(chore: getChores_chores): React.ReactNode {
    return chore.effortRatings.length > 0
      ? Math.min(...chore.effortRatings.map(e => e.effort))
      : 0;
  }
};
export default CompactChoreListItem;
