import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonSegment,
  IonTitle,
  IonButtons,
  IonMenuButton
} from "@ionic/react";
import { withRouter, RouteComponentProps } from "react-router";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { getSelectedHousehold } from "../__generated__/getSelectedHousehold";

type Props = RouteComponentProps & {
  onAddClick: () => void;
};

export const SELECTED_HOUSEHOLD_QUERY = gql`
  query getSelectedHousehold {
    selectedHousehold {
      name
    }
  }
`;

const WorkHeader = class Header extends React.Component<Props, {}> {
  render() {
    return (
      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonMenuButton color="primary" />
          </IonButtons>
          <IonSegment>
            <IonTitle>
              {this.props.location.pathname.indexOf("todo") > 0
                ? "Todo"
                : "Planera "}
              {this.props.location.pathname.indexOf("todo") < 0 && (
                <Query<getSelectedHousehold>
                  query={SELECTED_HOUSEHOLD_QUERY}
                  fetchPolicy="cache-and-network"
                >
                  {({ data, loading }) => {
                    if (loading && !data.selectedHousehold) return <span />;
                    return (
                      <span className="household-title">
                        ({data!.selectedHousehold!.name})
                      </span>
                    );
                  }}
                </Query>
              )}
            </IonTitle>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
    );
  }
};
export default withRouter(WorkHeader);
