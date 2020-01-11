import { ChoreResolvers } from "../generated/graphqlgen";

export const Chore: ChoreResolvers.Type = {
  ...ChoreResolvers.defaultResolvers,

  effortRatings: (parent, args, ctx) => {
    return ctx.prisma.chore({ id: parent.id }).effortRatings();
  },
  household: (parent, args, ctx) => {
    return ctx.prisma.chore({ id: parent.id }).household();
  },
  assignee: (parent, args, ctx) => {
    return ctx.prisma.chore({ id: parent.id }).assignee();
  },
  lockedToUser: (parent, args, ctx) => {
    return ctx.prisma.chore({ id: parent.id }).lockedToUser();
  }
};
