import * as React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonTitle,
  IonContent,
  IonFooter,
  IonRouterOutlet,
  IonPage
} from "@ionic/react";
import { TabButton } from "../../components/TabButton/TabButton";
import { home } from "ionicons/icons";
import { Route, withRouter, RouteComponentProps } from "react-router";
import ManageHouseholds from "./ManageHouseholds";

type Props = RouteComponentProps & {};

const ManageStack = function App(props: Props) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonMenuButton color="primary" />
          </IonButtons>
          <IonSegment>
            <IonTitle>Mitt Plana</IonTitle>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRouterOutlet animated={false}>
          <Route
            path="/manage/households"
            component={() => <ManageHouseholds />}
            // component={() => <div>Hej</div>}
            exact={true}
          />
        </IonRouterOutlet>
      </IonContent>
      <IonFooter>
        <IonToolbar color="light">
          <IonButtons className="tabButtons">
            <TabButton
              href="/manage/households"
              icon={home}
              label="Households"
              isActive={props.location.pathname.indexOf("households") > 0}
            />
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default withRouter(ManageStack);
