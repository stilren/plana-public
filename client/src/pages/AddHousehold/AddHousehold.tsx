import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import {
  addHousehold,
  addHouseholdVariables
} from "../../__generated__/addHousehold";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonContent,
  IonInput,
  IonIcon,
  IonLabel,
  IonBackButton
} from "@ionic/react";
import "./AddHousehold.css";
import { withRouter, RouteComponentProps } from "react-router";

const ADD_HOUSEHOLD = gql`
  mutation addHousehold($name: String!) {
    createHousehold(name: $name) {
      id
    }
  }
`;

type State = {
  name: string;
};

type Props = RouteComponentProps & {
  dismissModal: () => void;
};

const AddHouseholdComponent = class AddHousehold extends React.Component<
  Props,
  State
> {
  addHouseholdRef: React.Ref<HTMLFormElement>;
  constructor(props: Props) {
    super(props);
    this.state = {
      name: ""
    };
    this.addHouseholdRef = React.createRef();
  }
  render() {
    return (
      <>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton
                onClick={() => {
                  this.props.history.goBack();
                }}
                defaultHref="/"
              />
            </IonButtons>
            <IonTitle>Skapa hushåll</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <Mutation<addHousehold, addHouseholdVariables>
            mutation={ADD_HOUSEHOLD}
          >
            {addHousehold => (
              <form
                ref={this.addHouseholdRef}
                onSubmit={e => {
                  e.preventDefault();
                  addHousehold({ variables: { name: this.state.name } });
                  this.setState({
                    name: ""
                  });
                  this.props.history.push("plan/upnext");
                }}
              >
                <div className="form-outer">
                  <div className="form-item">
                    <IonLabel>Name</IonLabel>
                    <IonInput
                      required
                      autofocus
                      mode="ios"
                      onIonChange={e =>
                        this.setState(prevState => ({
                          name: e.detail!.value!
                        }))
                      }
                      value={this.state.name}
                      name="name"
                      type="text"
                    />
                  </div>
                  <IonButton class="form-button" type="submit">
                    OK!
                  </IonButton>
                </div>
              </form>
            )}
          </Mutation>
        </IonContent>
      </>
    );
  }
};

export default withRouter(AddHouseholdComponent);
