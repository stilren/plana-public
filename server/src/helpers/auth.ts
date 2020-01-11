import * as jwt from "jsonwebtoken";
import * as jwksRsa from 'jwks-rsa';


const jwksClient = require('jwks-rsa')
const jwks = jwksRsa({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://dev-egj45vvq.eu.auth0.com/.well-known/jwks.json'
})

interface IdTokenResult {
  header: Header,
  payload: any
}

interface Header {
  kid: string
}

const validateAndParseIdToken = (idToken: string) => new Promise((resolve, reject) => {
  const {header, payload} = jwt.decode(idToken, {complete: true}) as IdTokenResult
  if (!header || !header.kid || !payload) reject(new Error('Invalid Token'))
  jwks.getSigningKey(header.kid, (err, key) => {
    if (err) reject(new Error('Error getting signing key: ' + err.message))
    jwt.verify(idToken, key.publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) reject('jwt verify error: ' + err.message)
      resolve(decoded)
    })
  })
})

export default validateAndParseIdToken