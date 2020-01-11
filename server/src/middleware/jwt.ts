import * as jwt from "express-jwt";
import * as jwksRsa from "jwks-rsa";
// Authentication middleware. When used, the
// if the access token exists, it be verified against
// the Auth0 JSON Web Key Set

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-egj45vvq.eu.auth0.com/.well-known/jwks.json"
  }),
  audience: process.env["AUDIANCE"],
  issuer: "https://dev-egj45vvq.eu.auth0.com/",
  algorithms: ["RS256"]
});

export default jwtCheck;
