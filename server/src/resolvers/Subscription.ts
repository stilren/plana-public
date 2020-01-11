// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { SubscriptionResolvers } from "../generated/graphqlgen";
import { ToChoreFilter } from "../helpers/util";

export const Subscription: SubscriptionResolvers.Type = {
  ...SubscriptionResolvers.defaultResolvers,
  choreChanges: {
    //Needs auth
    subscribe: async (parent, args, ctx) => {
      const filter = await ToChoreFilter(args.filter, ctx);
      return ctx.prisma.$subscribe.chore({
        node: filter,
        mutation_in: ["CREATED", "DELETED", "UPDATED"]
      });
    },
    resolve: payload => {
      return payload;
    }
  }
};
