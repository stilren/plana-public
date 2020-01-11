import React, { useEffect, useState } from "react";

import {
  IonList,
  IonRadioGroup,
  IonListHeader,
  IonLabel,
  IonRadio,
  IonItem
} from "@ionic/react";

var itemStyle = {
  display: "flex",
  justifyContent: "space-around"
};

type Props = {
  onChange: (value: number) => any;
  value: number | null | undefined;
};

const EffortRatingPicker: React.SFC<Props> = props => {
  return (
    <IonRadioGroup
      name="efforRating"
      onIonChange={radio => {
        props.onChange(radio.detail.value);
      }}
    >
      <IonListHeader>Hur jobbigt tycker du det är?</IonListHeader>
      <div style={itemStyle}>
        <IonItem lines="none">
          <IonLabel>Lätt</IonLabel>
          <IonRadio checked={props.value === 1} value={1} />
        </IonItem>

        <IonItem lines="none">
          <IonLabel>Medel</IonLabel>
          <IonRadio checked={props.value === 2} value={2} />
        </IonItem>

        <IonItem lines="none">
          <IonLabel>Jobbigt</IonLabel>
          <IonRadio checked={props.value === 3} value={3} />
        </IonItem>
      </div>
    </IonRadioGroup>
  );
};

export default EffortRatingPicker;
