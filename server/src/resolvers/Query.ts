// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { QueryResolvers, ChoreStatus } from "../generated/graphqlgen";
import { Household, ChoreWhereInput } from "../generated/prisma-client";
import { ToChoreFilter } from "../helpers/util";
import { Context } from "../types";

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  chore: (parent, args, ctx) => {
    return ctx.prisma.chore({ id: args.id });
  },
  household: (parent, args, ctx) => {
    return ctx.prisma.household({ id: args.id });
  },
  user: (parent, args, ctx) => {
    return ctx.prisma.user({ id: args.id });
  },
  userByEmail: (parent, args, ctx) => {
    return ctx.prisma.user({ email: args.email });
  },
  me: (parent, args, ctx) => {
    return ctx.prisma.user({ id: ctx.currentUser.id });
  },
  chores: async (parent, args, ctx) => {
    //Needs auth
    const filter = await ToChoreFilter(args.filter, ctx);
    if (filter === null) return [];
    return ctx.prisma.chores({
      where: filter,
      orderBy: "updatedAt_DESC"
    });
  },
  unvotedChores: async (parent, args, ctx) => {
    const filter = await ToChoreFilter(args.filter, ctx);
    if (filter === null) return [];
    return ctx.prisma.chores({
      where: { AND: [filter, { effortRatings_every: { id: null } }] }
    });
  },
  selectedHousehold: (parent, args, ctx) => {
    return ctx.prisma.user({ id: ctx.currentUser.id }).selectedHousehold();
  },
  myUnvotedChores: async (parent, args, ctx) => {
    const filter = await ToChoreFilter(null, ctx);
    return ctx.prisma.chores({
      where: {
        AND: [
          filter,
          { effortRatings_none: { user: { id: ctx.currentUser.id } } }
        ]
      }
    });
  }
};
