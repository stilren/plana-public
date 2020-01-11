import { EffortRatingResolvers } from "../generated/graphqlgen";

export const EffortRating: EffortRatingResolvers.Type = {
  ...EffortRatingResolvers.defaultResolvers,

  user: (parent, args, ctx) => {
    return ctx.prisma.effortRating({ id: parent.id }).user();
  },
  chore: (parent, args, ctx) => {
    return ctx.prisma.effortRating({ id: parent.id }).chore();
  }
};
