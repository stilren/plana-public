// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { MutationResolvers } from "../generated/graphqlgen";
import validateAndParseIdToken from "../helpers/auth";
import { assignmentApi } from "../api/assignmentApi";
import { ProblemStatement, ChoreCore } from "../api/assignmentModels";
import {
  ToCreateChore,
  ToUpdateChore,
  dateFormat,
  getRecurringChoreNextDate
} from "../helpers/util";
import { UserUpdateOneWithoutLockedChoresInput } from "../generated/prisma-client";

export const Mutation: MutationResolvers.Type = {
  ...MutationResolvers.defaultResolvers,
  createHousehold: async (parent, args, ctx) => {
    const household = await ctx.prisma.createHousehold({
      name: args.name,
      members: {
        connect: { id: ctx.currentUser.id }
      }
    });
    await ctx.prisma.updateUser({
      where: {
        id: ctx.currentUser.id
      },
      data: {
        selectedHousehold: {
          connect: { id: household.id }
        }
      }
    });
    return household;
  },
  createChore: async (parent, args, ctx) => {
    const householdId = await ctx.prisma
      .user({ id: ctx.currentUser.id })
      .selectedHousehold()
      .id();
    const chore = await ctx.prisma.createChore(
      ToCreateChore(args.input, householdId)
    );
    return chore;
  },
  createEffortRating: async (parent, args, ctx) => {
    const userId = args.userId ? args.userId : ctx.currentUser.id;
    await ctx.prisma.createEffortRating({
      effort: args.effort,
      user: {
        connect: { id: userId }
      },
      chore: {
        connect: { id: args.choreId }
      }
    });
    return ctx.prisma.chore({ id: args.choreId });
  },
  createUser: (parent, args, ctx) => {
    return ctx.prisma.createUser({
      name: args.name,
      email: args.email
    });
  },
  addUserToHousehold: async (parent, args, ctx) => {
    await ctx.prisma.updateHousehold({
      where: {
        id: args.householdId
      },
      data: {
        members: {
          connect: { id: ctx.currentUser.id }
        },
        invites: {
          disconnect: { id: ctx.currentUser.id }
        }
      }
    });
    return await ctx.prisma.user({ id: ctx.currentUser.id });
  },
  selectHousehold: (parent, args, ctx) => {
    return ctx.prisma.updateUser({
      where: {
        id: ctx.currentUser.id
      },
      data: {
        selectedHousehold: {
          connect: { id: args.householdId }
        }
      }
    });
  },
  authenticate: async (parent, args, ctx) => {
    let userToken = null;
    try {
      userToken = await validateAndParseIdToken(args.idToken);
    } catch (err) {
      throw new Error(err.message);
    }
    const auth0id = userToken.sub.split("|")[1];
    let user = await ctx.prisma.user({ googleId: auth0id });
    if (!user) {
      user = await ctx.prisma.createUser({
        name: userToken.name,
        email: userToken.email,
        familyName: userToken.family_name,
        givenName: userToken.given_name,
        googleId: auth0id
      });
    }
    return user;
  },
  updateChoreUpnextState: async (parent, args, ctx) => {
    const chore = await ctx.prisma.chore({ id: args.choreId });
    if (args.isUpnext == true && chore.recurrenceType === "AUTOMATIC") {
      //If we are manually moving the chore to upnext from recurring list we will skip one occurence
      const nextDate = getRecurringChoreNextDate(chore);
      return ctx.prisma.updateChore({
        where: { id: args.choreId },
        data: { isUpnext: args.isUpnext, recurringNextOccurence: nextDate }
      });
    }
    return ctx.prisma.updateChore({
      where: { id: args.choreId },
      data: { isUpnext: args.isUpnext }
    });
  },
  assignChores: async (parent, args, ctx) => {
    const fragment = `
      fragment ChoreWithEffortRatings on Chore {
        id, 
        effortRatings { user { id } effort}
        lockedToUser {id}
      }
    `;
    const choresWithEffortRatings = await ctx.prisma
      .chores({ where: { id_in: args.choresIds } })
      .$fragment<ChoreWithEffortRatingFragment.Chore[]>(fragment);

    const coreChores: ChoreCore[] = choresWithEffortRatings.map(c => ({
      choreId: c.id,
      effortRatings: c.effortRatings.map(e => ({
        userId: e.user.id,
        effort: e.effort
      })),
      lockedToUserId: c.lockedToUser ? c.lockedToUser.id : null
    }));

    const users = await ctx.prisma
      .user({ id: ctx.currentUser.id })
      .selectedHousehold()
      .members();

    const problemStatement: ProblemStatement = {
      users: users.map(u => ({
        userId: u.id,
        shareOfChoresPercent: 0
      })),
      chores: coreChores,
      customShareOfChores: false
    };

    const assignments = await assignmentApi.assign(problemStatement);

    const choreUpdateTasks = assignments.choreToUserMap.map(c =>
      ctx.prisma.updateChore({
        where: { id: c.value },
        data: { assignee: { connect: { id: c.key } } }
      })
    );

    await Promise.all(choreUpdateTasks);
    return await ctx.prisma.chores({ where: { id_in: args.choresIds } });
  },
  startTodo: async (parent, args, ctx) => {
    const householdId = await ctx.prisma
      .user({ id: ctx.currentUser.id })
      .selectedHousehold()
      .id();

    await ctx.prisma.updateManyChores({
      where: {
        AND: [
          { todoState: "DONE" },
          { todoState: "TODO" },
          { household: { id: householdId } }
        ]
      },
      data: { todoState: "NOT_IN_TODO" }
    });

    const recurringChores = await ctx.prisma.chores({
      where: {
        AND: [{ id_in: args.choreIds }, { recurrenceType: "AUTOMATIC" }]
      }
    });

    const choreUpdateTask = recurringChores.map(c => {
      const nextDate = getRecurringChoreNextDate(c);
      return ctx.prisma.updateChore({
        where: { id: c.id },
        data: {
          recurringNextOccurence: nextDate,
          todoState: "TODO",
          isUpnext: false
        }
      });
    });

    await Promise.all(choreUpdateTask);

    await ctx.prisma.updateManyChores({
      where: {
        AND: [
          { id_in: args.choreIds },
          { id_not_in: recurringChores.map(c => c.id) }
        ]
      },
      data: { todoState: "TODO", isUpnext: false }
    });
    return true;
  },
  setTodoState: (parent, args, ctx) => {
    return ctx.prisma.updateChore({
      where: { id: args.choreId },
      data: { todoState: args.state }
    });
  },
  updateChore: async (parent, args, ctx) => {
    if (args.input.effort) {
      if (args.input.effort.effortId) {
        await ctx.prisma.updateEffortRating({
          where: { id: args.input.effort.effortId },
          data: { effort: args.input.effort.effort }
        });
      } else {
        await ctx.prisma.createEffortRating({
          effort: args.input.effort.effort,
          user: {
            connect: { id: args.input.effort.userId }
          },
          chore: {
            connect: { id: args.choreId }
          }
        });
      }
    }

    return await ctx.prisma.updateChore({
      where: { id: args.choreId },
      data: ToUpdateChore(args.input)
    });
  },
  lockChoreToUser: (parent, args, ctx) => {
    let lockedConnection: UserUpdateOneWithoutLockedChoresInput = null;
    if (!args.input.locked) {
      lockedConnection = { disconnect: true };
    } else {
      lockedConnection = { connect: { id: args.input.userId } };
    }
    return ctx.prisma.updateChore({
      where: { id: args.input.choreId },
      data: {
        lockedToUser: lockedConnection
      }
    });
  },
  moveChoresFromTodoToUpnext: async (parent, args, ctx) => {
    const householdId = args.householdId
      ? args.householdId
      : await ctx.prisma
          .user({ id: ctx.currentUser.id })
          .selectedHousehold()
          .id();

    await ctx.prisma.updateManyChores({
      where: {
        AND: [
          { OR: [{ todoState: "DONE" }, { todoState: "TODO" }] },
          { household: { id: householdId } }
        ]
      },
      data: { todoState: "NOT_IN_TODO", isUpnext: true }
    });
    return ctx.prisma.chores({
      where: {
        AND: [{ isUpnext: true }, { household: { id: householdId } }]
      }
    });
  },
  setTodoStateBatch: async (parent, args, ctx) => {
    await ctx.prisma.updateManyChores({
      where: { id_in: args.choreIds },
      data: { todoState: args.state }
    });
    return ctx.prisma.chores({ where: { id_in: args.choreIds } });
  },
  createInvite: async (parent, args, ctx) => {
    const householdId = args.householdId
      ? args.householdId
      : await ctx.prisma
          .user({ id: ctx.currentUser.id })
          .selectedHousehold()
          .id();
    const userToInvite = await ctx.prisma.user({ email: args.email });
    if (userToInvite === null) return null;
    await ctx.prisma.updateHousehold({
      where: { id: householdId },
      data: { invites: { connect: { id: userToInvite.id } } }
    });
    return await ctx.prisma.user({ id: ctx.currentUser.id });
  },
  deleteInvite: async (parent, args, ctx) => {
    const householdId = args.householdId
      ? args.householdId
      : await ctx.prisma
          .user({ id: ctx.currentUser.id })
          .selectedHousehold()
          .id();

    await ctx.prisma.updateHousehold({
      where: { id: householdId },
      data: { invites: { disconnect: { email: args.email } } }
    });
    return await ctx.prisma.user({ id: ctx.currentUser.id });
  }
};

declare module ChoreWithEffortRatingFragment {
  export interface User {
    id: string;
  }

  export interface EffortRating {
    user: User;
    effort: number;
  }

  export interface Chore {
    id: string;
    effortRatings: EffortRating[];
    lockedToUser: User | null;
  }
}
