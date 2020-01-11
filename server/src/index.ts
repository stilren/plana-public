require("dotenv").config();
import { GraphQLServer } from "graphql-yoga";
import { prisma } from "./generated/prisma-client";
import { resolvers } from "./resolvers";
import { CurrentUser } from "./types";
import checkJwt from "./middleware/jwt";
import getUser from "./middleware/getUser";
import * as schedule from "node-schedule";
import { recurringTaskJob } from "./jobs/recurringTasksJob";

const NodeCache = require("node-cache");
const myCache = new NodeCache();
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    prisma
  },
  middlewares: []
} as any);

recurringTaskJob();
schedule.scheduleJob("1 0 * * *", recurringTaskJob); //At 00:01. every day

server.express.post(
  server.options.endpoint,
  checkJwt,
  (err, req, res, next) => {
    console.log("No token " + err);
    if (err && process.env["ENVIRONMENT"] !== "dev") {
      return res.status(401).send(err.message);
    }
    next();
  }
);

server.express.post(server.options.endpoint, (req, res, next) =>
  getUser(req, res, next, server.context)
);

server.start(() => console.log("Server is running on http://localhost:4000"));
