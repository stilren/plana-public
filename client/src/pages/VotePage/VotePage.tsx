import * as React from "react";
import { Query, Mutation, MutationFn } from "react-apollo";
import {
  getChores,
  getChoresVariables,
  getChores_chores
} from "../../__generated__/getChores";
import { GET_CHORES_QUERY } from "../Upnext/Upnext";
import { ChoreStatus } from "../../__generated__/globalTypes";
import {
  IonPage,
  IonContent,
  IonSlide,
  IonSlides,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonTitle,
  IonText
} from "@ionic/react";
import {
  addEffortCollected,
  addEffortCollectedVariables
} from "../../__generated__/addEffortCollected";
import {
  getmyUnvotedChores,
  getmyUnvotedChores_myUnvotedChores
} from "../../__generated__/getmyUnvotedChores";
import VotingCard from "../../components/VotingCard";
import gql from "graphql-tag";

type Props = {};

const VotePage = class VotePage extends React.Component<Props, {}> {
  ionSliderRef: React.RefObject<HTMLIonSlidesElement>;
  onSliderLoad = () => {
    this.ionSliderRef.current!.lockSwipes(true);
  };
  constructor(props: Props) {
    super(props);
    this.ionSliderRef = React.createRef();
  }
  render() {
    return (
      <Query<getmyUnvotedChores>
        query={GET_MY_UNVOTED_CHORES_QUERY}
        fetchPolicy="network-only"
      >
        {({ loading, data }) => {
          if (loading) return <div />;
          return (
            <IonPage>
              <IonHeader>
                <IonToolbar color="light">
                  <IonButtons slot="start">
                    <IonMenuButton color="primary" />
                  </IonButtons>
                  <IonSegment>
                    <IonTitle>Hur jobbig är uppgiften?</IonTitle>
                  </IonSegment>
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonSlides
                  style={{ height: "100%" }}
                  ref={this.ionSliderRef}
                  onIonSlidesDidLoad={this.onSliderLoad}
                >
                  <Mutation<addEffortCollected, addEffortCollectedVariables>
                    mutation={SET_EFFORT_RATING}
                  >
                    {addEffort =>
                      data.myUnvotedChores.map(chore => (
                        <IonSlide key={chore.id}>
                          <VotingCard
                            id={chore.id}
                            name={chore.name}
                            onEffortClick={effort =>
                              this.onEffortClick(effort, chore, addEffort, data)
                            }
                          />
                        </IonSlide>
                      ))
                    }
                  </Mutation>
                  <IonSlide style={{ padding: "15px" }}>
                    <IonText>
                      Bra jobbat! Du har röstat på alla uppgifter.
                    </IonText>
                  </IonSlide>
                </IonSlides>
              </IonContent>
            </IonPage>
          );
        }}
      </Query>
    );
  }
  onEffortClick = (
    effort: number,
    chore: getmyUnvotedChores_myUnvotedChores,
    addEffort: MutationFn<addEffortCollected, addEffortCollectedVariables>,
    data: getmyUnvotedChores
  ) => {
    addEffort({
      variables: { effortRating: effort, choreId: chore.id }
    });
    this.ionSliderRef.current!.lockSwipes(false);
    this.ionSliderRef.current!.slideNext();
    this.ionSliderRef.current!.lockSwipes(true);
  };
};

export const GET_MY_UNVOTED_CHORES_QUERY = gql`
  query getmyUnvotedChores {
    myUnvotedChores {
      name
      id
    }
  }
`;

const SET_EFFORT_RATING = gql`
  mutation addEffortCollected($userId: ID, $choreId: ID!, $effortRating: Int!) {
    createEffortRating(
      userId: $userId
      choreId: $choreId
      effort: $effortRating
    ) {
      name
      id
    }
  }
`;

export default VotePage;
