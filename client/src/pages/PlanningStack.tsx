import React from "react";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonContent,
  IonToolbar,
  IonButtons,
  IonButton,
  IonFooter,
  IonFab,
  IonFabButton
} from "@ionic/react";
import { Route, withRouter, RouteComponentProps } from "react-router";
import { Upnext } from "./Upnext/Upnext";
import { Archive } from "./Archive/Archive";
import Recurring from "./Recurring/Recurring";
import WorkHeader from "../components/WorkHeader";
import Todo from "./Todo/Todo";
import {
  checkboxOutline,
  flash,
  infinite,
  filing,
  checkmark
} from "ionicons/icons";
import "./PlanningStack.css";
import { TabButton } from "../components/TabButton/TabButton";

type State = {
  showAddModal: boolean;
};

const PlanningStack = class PlanningStack extends React.Component<
  RouteComponentProps,
  State
> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      showAddModal: false
    };
  }
  render() {
    return (
      <div className="ion-page">
        <WorkHeader
          onAddClick={() => this.setState(() => ({ showAddModal: true }))}
        />
        <IonContent>
          <IonRouterOutlet animated={false}>
            <Route
              path="/plan/:upnext(upnext)"
              component={() => <Upnext />}
              exact={true}
            />
            <Route
              path="/plan/:archive(archive)"
              component={() => <Archive />}
              exact={true}
            />
            <Route
              path="/plan/:recurring(recurring)"
              component={() => <Recurring />}
              exact={true}
            />
            <Route
              path="/plan/todo"
              component={() => (
                <IonContent>
                  <Todo />
                </IonContent>
              )}
              exact={true}
            />
          </IonRouterOutlet>
        </IonContent>
        <IonFooter>
          <IonToolbar color="light">
            <IonButtons className="tabButtons">
              <TabButton
                href="/plan/todo"
                icon={checkboxOutline}
                label="Todo"
                isActive={this.props.location.pathname.indexOf("todo") > 0}
              />
              <TabButton
                href="/plan/upnext"
                icon={flash}
                label="Upnext"
                isActive={this.props.location.pathname.indexOf("upnext") > 0}
              />
              <TabButton
                href="/plan/archive"
                icon={filing}
                label="Archive"
                isActive={this.props.location.pathname.indexOf("archive") > 0}
              />
              <TabButton
                href="/plan/recurring"
                icon={infinite}
                label="Recurring"
                isActive={this.props.location.pathname.indexOf("recurring") > 0}
              />
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </div>
    );
  }
};

export default withRouter(PlanningStack);
