import React, { Component, RefObject } from "react";
import { Query, Mutation, MutationFn } from "react-apollo";
import {
  getChores,
  getChoresVariables,
  getChores_chores
} from "../../__generated__/getChores";
import { GET_CHORES_QUERY } from "../Upnext/Upnext";
import { ChoreStatus } from "../../__generated__/globalTypes";
import { RouteComponentProps, withRouter } from "react-router";
import { IonPage, IonContent, IonSlide, IonText } from "@ionic/react";
import VotingCard from "../../components/VotingCard";
import { choreFragments } from "../../sharedGraphql/choreFragments";
import gql from "graphql-tag";
import { addEffort, addEffortVariables } from "../../__generated__/addEffort";

type Props = RouteComponentProps & {};

const RemainingVotes = class StartTodo extends Component<Props, {}> {
  ionSliderRef: RefObject<HTMLIonSlidesElement>;
  constructor(props: Props) {
    super(props);
    this.ionSliderRef = React.createRef();
  }
  render() {
    return (
      <Query<getChores, getChoresVariables>
        query={GET_CHORES_QUERY}
        variables={{
          choreStatus: [ChoreStatus.UPNEXT]
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data }) => {
          if (loading) return <div />;
          if (!data) this.props.history.push("/plan/upnext");
          const unvoted = data.chores.filter(c => c.effortRatings.length === 0);
          if (unvoted.length === 0) {
            if (this.props.location.pathname.indexOf("start/vote") > 0) {
              this.props.history.push("/start/assign");
            }
            return <div />;
          }
          return (
            <IonPage>
              <IonContent>
                <Mutation<addEffort, addEffortVariables>
                  mutation={SET_EFFORT_RATING}
                >
                  {addEffort =>
                    unvoted.map(chore => (
                      <IonSlide key={chore.id}>
                        <VotingCard
                          id={chore.id}
                          name={chore.name}
                          onEffortClick={effort =>
                            this.onEffortClick(effort, chore, addEffort)
                          }
                        />
                      </IonSlide>
                    ))
                  }
                </Mutation>
              </IonContent>
            </IonPage>
          );
        }}
      </Query>
    );
  }
  onEffortClick = (
    effort: number,
    chore: getChores_chores,
    addEffort: MutationFn<addEffort, addEffortVariables>
  ) => {
    addEffort({
      variables: { effortRating: effort, choreId: chore.id },
      optimisticResponse: {
        createEffortRating: {
          ...chore,
          effortRatings: [{ __typename: "EffortRating", effort: effort }]
        }
      },
      update: (proxy, { data }) => {
        const cachedData = proxy.readQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: [ChoreStatus.UPNEXT] }
        });
        proxy.writeQuery<getChores, getChoresVariables>({
          query: GET_CHORES_QUERY,
          variables: { choreStatus: [ChoreStatus.UPNEXT] },
          data: {
            chores: cachedData.chores.map(c => {
              if (c.id === data.createEffortRating.id)
                return data.createEffortRating;
              return c;
            })
          }
        });
      }
    });
  };
  moveNextEffort = () => {
    this.ionSliderRef.current!.isEnd().then(isEnd => {
      if (isEnd) this.props.history.push("/start/assign");
      this.ionSliderRef.current!.lockSwipes(false);
      this.ionSliderRef.current!.slideNext();
      this.ionSliderRef.current!.lockSwipes(true);
    });
  };
};

export const SET_EFFORT_RATING = gql`
  mutation addEffort($userId: ID, $choreId: ID!, $effortRating: Int!) {
    createEffortRating(
      userId: $userId
      choreId: $choreId
      effort: $effortRating
    ) {
      ...ChoreInList
    }
  }
  ${choreFragments.choreInList}
`;

export default withRouter(RemainingVotes);
