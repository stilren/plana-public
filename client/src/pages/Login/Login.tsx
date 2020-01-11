import React from "react";
import { IonContent, IonButton } from "@ionic/react";
import "./Login.css";

type Props = {
  login: (para: MouseEvent) => void;
};

export const Login: React.SFC<Props> = ({ login }) => (
  <IonContent fullscreen color="primary">
    <div className="login-outer">
      <h1>Plana</h1>
      <IonButton class="ghost" onClick={login} color="secondary">
        LOGIN/SIGNUP
      </IonButton>
    </div>
  </IonContent>
);
