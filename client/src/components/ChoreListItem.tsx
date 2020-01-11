import * as React from "react";
import { IonItem, IonBadge, IonLabel, IonIcon } from "@ionic/react";
import { withRouter, RouteComponentProps } from "react-router";
import { getChores_chores } from "../__generated__/getChores";
import { RecurrenceType } from "../__generated__/globalTypes";

type Props = RouteComponentProps & {
  chore: getChores_chores;
  showAssignee?: boolean;
};

const ChoreListItem = class SlidingChoreListItem extends React.Component<
  Props
> {
  render() {
    return (
      <IonItem
        onClick={() => this.props.history.push(`/chore/${this.props.chore.id}`)}
        lines="none"
      >
        <IonBadge slot="start" color="secondary">
          {this.choreEffort(this.props.chore)}
        </IonBadge>
        <IonLabel>
          <h2>{this.props.chore.name}</h2>
          <h3>{this.choreAssignee(this.props.chore)}</h3>
          {this.props.chore.recurrenceType === RecurrenceType.AUTOMATIC && (
            <h3>{`Schemalagd till ${this.props.chore.recurringNextOccurence.substring(
              0,
              10
            )}`}</h3>
          )}
        </IonLabel>
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
    if (!chore.lockedToUser) return "";
    const name = chore.lockedToUser
      ? chore.lockedToUser.givenName
        ? chore.lockedToUser.givenName
        : chore.lockedToUser.name
      : null;
    return "Låst till: " + name;
  }
  choreEffort(chore: getChores_chores): React.ReactNode {
    return chore.effortRatings.length > 0
      ? Math.min(...chore.effortRatings.map(e => e.effort))
      : 0;
  }
};
export default withRouter(ChoreListItem);
