import React from "react";
import gql from "graphql-tag";
import {
  MutationFn,
  Mutation,
  withApollo,
  WithApolloClient
} from "react-apollo";
import { addEffort, addEffortVariables } from "../__generated__/addEffort";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from "@ionic/react";

const SET_EFFORT_RATING = gql`
  mutation addEffort($userId: ID, $choreId: ID!, $effortRating: Int!) {
    createEffortRating(
      userId: $userId
      choreId: $choreId
      effort: $effortRating
    ) {
      id
      effort
    }
  }
`;

type Props = {
  id: string;
  name: string;
  onEffortClick: (effort: number) => void;
};

const VotingCard = class VotingCard extends React.Component<
  WithApolloClient<Props>,
  {}
> {
  render() {
    return (
      <IonCard>
        <div className="card_top-color" />
        <IonCardHeader>
          <IonCardTitle>{this.props.name}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <Mutation<addEffort, addEffortVariables> mutation={SET_EFFORT_RATING}>
            {setRating => (
              <>
                <IonButton
                  onClick={() => this.props.onEffortClick(1)}
                  shape="round"
                  fill="outline"
                >
                  1
                </IonButton>
                <IonButton
                  onClick={() => this.props.onEffortClick(2)}
                  shape="round"
                  fill="outline"
                >
                  2
                </IonButton>
                <IonButton
                  onClick={() => this.props.onEffortClick(3)}
                  shape="round"
                  fill="outline"
                >
                  3
                </IonButton>{" "}
              </>
            )}
          </Mutation>
        </IonCardContent>
      </IonCard>
    );
  }
};

export default withApollo(VotingCard);
