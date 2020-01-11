import React, { Component } from "react";
import {
  IonPage,
  IonContent,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton
} from "@ionic/react";
import { Route, RouteComponentProps, withRouter, Switch } from "react-router";
import { checkboxOutline, flash, filing, infinite } from "ionicons/icons";
import RemainingTodos from "./RemainingTodos";
import RemainingVotes from "./RemainingVotes";
import AssignChores from "./AssignChores";

type Props = RouteComponentProps<{}>;

const StartTodo = class StartTodo extends Component<Props, {}> {
  render() {
    return (
      <IonPage>
        <IonHeader no-border>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton
                onClick={() => this.props.history.push("/plan/upnext")}
              >
                Avbryt
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/start/vote" component={() => <RemainingVotes />} />
              <Route
                path="/start/todo"
                exact={true}
                component={() => {
                  return <RemainingTodos />;
                }}
              />
              <Route
                path="/start/assign"
                exact={true}
                component={() => {
                  return <AssignChores />;
                }}
              />
            </IonRouterOutlet>
            <IonTabBar hidden={true} slot="bottom" />
          </IonTabs>
        </IonContent>
      </IonPage>
    );
  }
};

export default withRouter(StartTodo);
