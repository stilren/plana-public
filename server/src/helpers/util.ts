import {
  ChoreStatus,
  QueryResolvers,
  MutationResolvers
} from "../generated/graphqlgen";
import {
  ChoreWhereInput,
  ChoreCreateInput,
  ChoreUpdateInput,
  Chore,
  UserUpdateOneWithoutLockedChoresInput
} from "../generated/prisma-client";
import { Context } from "../types";

export function ToStatusFilter(status: ChoreStatus[]) {
  const statusFilter: ChoreWhereInput[] = [];
  if (status.includes("UPNEXT")) statusFilter.push({ isUpnext: true });

  if (status.includes("ARCHIVE")) {
    if (!status.includes("UPNEXT")) {
      //If we dont want to look at upnext but at archive (since upnext and archive is either or in the view)
      statusFilter.push({
        AND: [{ isUpnext: false }, { recurrenceType: "MANUAL" }]
      });
    } else {
      statusFilter.push({ recurrenceType: "MANUAL" });
    }
  }
  if (status.includes("DONE")) {
    statusFilter.push({ todoState: "DONE" });
  }

  if (status.includes("TODO")) {
    statusFilter.push({ todoState: "TODO" });
  }

  if (status.includes("RECURRING")) {
    statusFilter.push({ recurrenceType: "AUTOMATIC" });
  }
  return statusFilter;
}

export async function ToChoreFilter(
  filter: QueryResolvers.ChoreFilter,
  ctx: Context
): Promise<ChoreWhereInput> {
  let households: string[] = [];
  let result: ChoreWhereInput;
  if (filter == null || filter!.households == null) {
    const selectedHousehold = await ctx.prisma
      .user({ id: ctx.currentUser.id })
      .selectedHousehold();
    if (selectedHousehold === null) return null;
    households.push(selectedHousehold.id);
  } else {
    households = filter.households;
  }

  if (filter == null || filter.status == null) {
    return { household: { id_in: households } };
  }

  return {
    AND: [
      { household: { id_in: households } },
      { OR: ToStatusFilter(filter.status) }
    ]
  };
}

export function ToCreateChore(
  choreInput: MutationResolvers.ChoreInput,
  householdId: string
): ChoreCreateInput {
  return {
    name: choreInput.name,
    description: choreInput.description,
    household: {
      connect: { id: householdId }
    },
    recurrenceType: choreInput.recurrenceType,
    recurringNextOccurence: choreInput.recurrenceInput
      ? choreInput.recurrenceInput.nextOccurence
      : null,
    recurringWeekCadence: choreInput.recurrenceInput
      ? choreInput.recurrenceInput.weekCadence
      : null,
    isUpnext: choreInput.isUpnext,
    assignee: choreInput.assignee
      ? { connect: { id: choreInput.assignee } }
      : null,
    todoState: choreInput.todoState ? choreInput.todoState : "NOT_IN_TODO",
    effortRatings: null
  };
}

export function ToUpdateChore(
  choreInput: MutationResolvers.ChoreInput
): ChoreUpdateInput {
  let lockedConnection: UserUpdateOneWithoutLockedChoresInput = null;
  if (choreInput.lockedToUser) {
    if (!choreInput.lockedToUser.locked) {
      lockedConnection = { disconnect: true };
    } else {
      lockedConnection = { connect: { id: choreInput.lockedToUser.userId } };
    }
  }
  return {
    name: choreInput.name,
    description: choreInput.description,
    recurrenceType: choreInput.recurrenceType,
    recurringNextOccurence: choreInput.recurrenceInput
      ? choreInput.recurrenceInput.nextOccurence
      : null,
    recurringWeekCadence: choreInput.recurrenceInput
      ? choreInput.recurrenceInput.weekCadence
      : null,
    isUpnext: choreInput.isUpnext,
    assignee: choreInput.assignee
      ? { connect: { id: choreInput.assignee } }
      : null,
    todoState: choreInput.todoState ? choreInput.todoState : "NOT_IN_TODO",
    lockedToUser: lockedConnection
  };
}

export function dateFormat(date: Date) {
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();

  return [
    date.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd
  ].join("-");
}

export function getRecurringChoreNextDate(c: Chore): Date {
  let nextDate = new Date(c.recurringNextOccurence);
  nextDate.setDate(nextDate.getDate() + c.recurringWeekCadence * 7);
  return nextDate;
}
