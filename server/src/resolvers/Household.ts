// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { HouseholdResolvers } from "../generated/graphqlgen";
import { ToStatusFilter } from "../helpers/util";

export const Household: HouseholdResolvers.Type = {
  ...HouseholdResolvers.defaultResolvers,

  members: (parent, args, ctx) => {
    return ctx.prisma.household({ id: parent.id }).members();
  },
  chores: (parent, args, ctx) => {
    if (!args.filter) return ctx.prisma.household({ id: parent.id }).chores();
    const filter = ToStatusFilter(args.filter);

    return ctx.prisma
      .household({ id: parent.id })
      .chores({ where: { OR: filter } });
  },
  invites: (parent, args, ctx) => {
    return ctx.prisma.household({ id: parent.id }).invites();
  }
};
