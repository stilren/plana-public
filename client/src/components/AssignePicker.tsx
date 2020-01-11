import React from "react";
import {
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from "@ionic/react";

type AssigneOption = {
  name: string;
  id: string;
};

type Props = {
  value: string | null | undefined;
  options: AssigneOption[];
  onChange: (choice: string) => void;
};

const AssignePicker: React.SFC<Props> = props => (
  <IonList>
    <IonListHeader>Vem ska göra det?</IonListHeader>
    <IonItem lines="none">
      <IonLabel>Tilldelas</IonLabel>
      <IonSelect
        onIonChange={val => {
          props.onChange(val.detail.value);
        }}
        multiple={false}
        selectedText={
          props.options.find(o => o.id === props.value)
            ? props.options.find(o => o.id === props.value)!.name
            : ""
        }
      >
        {props.options.map(option => (
          <IonSelectOption
            selected={props.value === option.id}
            key={option.id}
            value={option.id}
          >
            {option.name}
          </IonSelectOption>
        ))}
      </IonSelect>
    </IonItem>
  </IonList>
);

export default AssignePicker;
