import React, { Component } from "react";
import { IonLoading } from "@ionic/react";
import { loadOptions } from "@babel/core";

type State = {
  loading: boolean;
};

class Callback extends Component<{}, State> {
  componentWillUnmount() {
    this.setState(() => ({
      loading: false
    }));
  }
  componentWillMount() {
    this.setState(() => ({
      loading: true
    }));
  }
  render() {
    return (
      <IonLoading
        isOpen={this.state.loading}
        onDidDismiss={() => this.setState({ loading: false })}
        message={"Loggar in dig!"}
      />
    );
  }
}

export default Callback;
