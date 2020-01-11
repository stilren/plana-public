// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { Resolvers } from "../generated/graphqlgen";

import { Query } from "./Query";
import { Chore } from "./Chore";
import { EffortRating } from "./EffortRating";
import { User } from "./User";
import { Household } from "./Household";
import { Mutation } from "./Mutation";
import { Subscription } from "./Subscription";
import { ChoreSubscriptionPayload } from "../generated/tmp-resolvers/ChoreSubscriptionPayload";
import { ChorePreviousValues } from "../generated/tmp-resolvers/ChorePreviousValues";

export const resolvers: Resolvers = {
  Query,
  Chore,
  EffortRating,
  User,
  Household,
  Mutation,
  Subscription,
  ChoreSubscriptionPayload,
  ChorePreviousValues
};
