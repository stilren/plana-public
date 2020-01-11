// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { UserResolvers } from "../generated/graphqlgen";

export const User: UserResolvers.Type = {
  ...UserResolvers.defaultResolvers,
  households: (parent, args, ctx) => {
    return ctx.prisma.user({ id: parent.id }).households();
  },
  chores: (parent, args, ctx) => {
    return ctx.prisma.user({ id: parent.id }).chores();
  },
  selectedHousehold: (parent, args, ctx) => {
    return ctx.prisma.user({ id: parent.id }).selectedHousehold();
  },
  lockedChores: (parent, args, ctx) => {
    return ctx.prisma.user({ id: parent.id }).lockedChores();
  },
  invites: (parent, args, ctx) => {
    return ctx.prisma.user({ id: parent.id }).invites();
  }
};
