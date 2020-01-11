import React from "react"; // we need this to make JSX compile
import { IonButton, IonIcon, IonLabel } from "@ionic/react";
import "./TabButton.css";

type Props = {
  href: string;
  icon: {
    ios: string;
    md: string;
  };
  label: string;
  isActive: boolean;
};

export const TabButton = ({ href, icon, label, isActive }: Props) => (
  <IonButton
    color={isActive ? "primary" : ""}
    className="tabButton"
    href={href}
  >
    <div className="tabButtonWrapper">
      <IonIcon className="tabIcon" icon={icon} />
      <IonLabel className="tabLabel">{label}</IonLabel>
    </div>
  </IonButton>
);
