import auth0 from "auth0-js";
import history from "../history";
import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import {
  authenticate_authenticate,
  authenticate,
  authenticateVariables
} from "../__generated__/authenticate";

const AUTHENTICATE = gql`
  mutation authenticate($idToken: String!) {
    authenticate(idToken: $idToken) {
      id
      name
      email
      selectedHousehold {
        id
      }
      chores {
        id
      }
    }
  }
`;

export default class Auth {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  constructor(apolloClient: ApolloClient<NormalizedCacheObject>) {
    this.apolloClient = apolloClient;
  }

  auth0 = new auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH_DOMAIN,
    clientID: process.env.REACT_APP_AUTH_CLIENT_ID,
    redirectUri: process.env.REACT_APP_APP_URL + "/callback",
    audience: process.env.REACT_APP_AUTH_AUDIANCE,
    responseType: "token id_token",
    scope: "openid profile email"
  });

  login() {
    this.auth0.authorize();
  }

  async handleAuthentication() {
    console.log("starting authentication");
    this.auth0.parseHash(async (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        await this.getUserOrCreateAccount(authResult.idToken);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
      history.push("/");
      window.location.reload();
    });
  }

  getAccessToken() {
    return localStorage.accessToken;
  }

  getIdToken() {
    return localStorage.idToken;
  }

  async getUserOrCreateAccount(
    idToken: string
  ): Promise<authenticate_authenticate> {
    const response = await this.apolloClient.mutate<
      authenticate,
      authenticateVariables
    >({
      mutation: AUTHENTICATE,
      variables: { idToken: idToken }
    });
    localStorage.setItem("user", JSON.stringify(response.data.authenticate));
    return response.data.authenticate;
  }

  getUserFromCache(): authenticate_authenticate {
    var retrievedObject = localStorage.getItem("user");
    return retrievedObject !== null ? JSON.parse(retrievedObject) : null;
  }

  async getUser(): Promise<authenticate_authenticate> {
    const response = await this.apolloClient.mutate({
      mutation: AUTHENTICATE,
      variables: { idToken: this.getIdToken() }
    });
    return response.data.authenticate;
  }

  setSession(authResult: auth0.Auth0DecodedHash) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem("isLoggedIn", "true");
    if (!authResult.expiresIn) return "";
    // Set the time that the access token will expire at
    const idToken = authResult.idToken ? authResult.idToken : "";
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    localStorage.setItem(
      "accessToken",
      authResult.accessToken ? authResult.accessToken : ""
    );
    localStorage.setItem("idToken", idToken);
    localStorage.setItem("expiresAt", expiresAt ? expiresAt.toString() : "");
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(
          `Could not get a new token (${err.error}: ${err.errorDescription}).`
        );
      }
    });
  }

  async logout() {
    localStorage.accessToken = null;
    localStorage.idToken = null;
    localStorage.expiresAt = 0;
    localStorage.removeItem("isLoggedIn");
    await this.auth0.logout({
      returnTo: process.env.REACT_APP_APP_URL
    });
  }

  isAuthenticated() {
    let expiresAt = localStorage.expiresAt;
    const isAuthed = new Date().getTime() < expiresAt;
    return isAuthed;
  }
}
