import React, { Component } from "react";
import { ApolloProvider, Query } from "react-apollo";
import { IonApp, IonPage, IonSplitPane, IonLoading } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, RouteComponentProps, Redirect } from "react-router-dom";
import PlanningStack from "./pages/PlanningStack";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import "./theme.css";
import { WebSocketLink } from "apollo-link-ws";
import { split, ApolloLink } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import Callback from "./components/AuthCallback";
import Auth from "./auth/auth";
import { setContext } from "apollo-link-context";
import { Login } from "./pages/Login/Login";
import AddHousehold from "./pages/AddHousehold/AddHousehold";
import ManageStack from "./pages/Manage/ManageStack";
import history from "./history";
import gql from "graphql-tag";
import { getMyHouseholdsAndChores } from "./__generated__/getMyHouseholdsAndChores";
import ChoreDetails from "./pages/ChoreDetails/ChoreDetails";
import Menu from "./components/Menu";
import { warmCache } from "./utils/helpers";
import "./App.css";
import StartTodo from "./pages/StartTodo/StartTodo";
import VotePage from "./pages/VotePage/VotePage";
const authLink = setContext((_, { headers }) => {
  const token = auth.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});
const wsuri =
  process.env.NODE_ENV === "production" ? "produrl" : "ws://localhost:4000";

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_SERVER_WS,
  options: {
    reconnect: true
  }
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER
});

const linkSplit = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  // link: authLink.concat(linkSplit), this is for subsciptions which is not used anymore
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const auth = new Auth(client);

const handleAuthentication = async (nextState: RouteComponentProps) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    return await auth.handleAuthentication();
  }
};

const GET_MY_HOUSEHOLDS_CHORES = gql`
  # some server query
  query getMyHouseholdsAndChores {
    me {
      selectedHousehold {
        id
      }
      chores {
        id
        todoState
      }
    }
  }
`;
class IndexRoute extends Component {
  render() {
    return (
      <Query<getMyHouseholdsAndChores> query={GET_MY_HOUSEHOLDS_CHORES}>
        {({ loading, data, error }) => {
          if (loading) return <div>Loading Indexrute</div>;
          if (error) return <Redirect to="/login" />;
          if (!data) return <div>no data</div>;
          const chores = data!.me!.chores;
          if (data!.me!.selectedHousehold === null) {
            return <Redirect to="/addhousehold" />;
          }
          if (chores != null || chores!.length === 0) {
            return <Redirect to="/plan/todo" />;
          }
          return <Redirect to="/plan/upnext" />;
        }}
      </Query>
    );
  }
}

type State = {
  showLoading: boolean;
};

class App extends Component<{}, State> {
  state = {
    showLoading: false
  };
  checkAuth() {
    if (
      window.location.pathname.toLowerCase() === "/login" ||
      window.location.pathname.toLowerCase() === "/callback"
    )
      return;
    if (!auth.isAuthenticated()) {
      history.push("/login");
    }
    if (auth.isAuthenticated()) {
      const myWarmCache = warmCache.bind(this);
      myWarmCache(client);
    }
  }
  render() {
    return (
      <ApolloProvider client={client}>
        <IonApp>
          <IonReactRouter>
            <IonLoading
              isOpen={this.state.showLoading}
              onDidDismiss={() => this.setState({ showLoading: false })}
              message={"Värmer upp..."}
              duration={5000}
              cssClass="splashscreen"
            />
            <IonSplitPane contentId="main">
              <Menu auth={auth} user={auth.getUserFromCache()} />
              <IonPage id="main">
                <Route path="/" /> {this.checkAuth()}
                <Route exact path="/" component={IndexRoute} />
                <Route
                  path="/login"
                  component={() => <Login login={auth.login.bind(auth)} />}
                />
                <Route path="/plan" component={PlanningStack} />
                <Route path="/start" component={StartTodo} />
                <Route path="/addhousehold" component={AddHousehold} />
                <Route path="/chore/:choreId" component={ChoreDetails} />
                <Route path="/manage" component={ManageStack} />
                <Route path="/vote" component={VotePage} />
                <Route
                  path="/callback"
                  render={props => {
                    handleAuthentication(props);
                    return <Callback {...props} />;
                  }}
                />
              </IonPage>
            </IonSplitPane>
          </IonReactRouter>
        </IonApp>
      </ApolloProvider>
    );
  }
}

export default App;
