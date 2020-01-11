import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import {
  logOut,
  checkboxOutline,
  flash,
  home,
  rocket,
  disc
} from "ionicons/icons";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import Auth from "../auth/auth";
import { authenticate_authenticate } from "../__generated__/authenticate";

const routes = {
  appPages: [
    { title: "Todo", path: "/plan/todo", icon: checkboxOutline },
    { title: "Upnext", path: "/plan/upnext", icon: flash },
    { title: "Start todo", path: "/start/todo", icon: rocket }
  ],
  loggedInPages: [
    { title: "Households", path: "/manage/households", icon: home },
    { title: "Vote", path: "/vote", icon: disc }
  ]
};

type Props = RouteComponentProps & {
  user: authenticate_authenticate;
  auth: Auth;
};

const Menu: React.SFC<Props> = ({ history, user, auth }) => {
  function renderlistItems(list: any[]) {
    return list
      .filter(route => !!route.path)
      .map(p => (
        <IonMenuToggle key={p.title} auto-hide="false">
          <IonItem button onClick={() => history.push(p.path)}>
            <IonIcon slot="start" icon={p.icon} />
            <IonLabel>{p.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Plana - {user && user.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="outer-content">
        <IonList>
          <IonListHeader>Plan</IonListHeader>
          {renderlistItems(routes.appPages)}
        </IonList>
        <IonList>
          <IonListHeader>Account</IonListHeader>
          {renderlistItems(routes.loggedInPages)}
          <IonItem onClick={() => auth.logout()}>
            <IonIcon slot="start" icon={logOut} />
            Log out
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(Menu);
