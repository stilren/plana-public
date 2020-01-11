import { prisma } from "../generated/prisma-client";
import { dateFormat } from "../helpers/util";

export const recurringTaskJob = async (): Promise<Boolean> => {
  const now = new Date();
  console.log("running recurring task job" + now);
  let oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  await prisma.updateManyChores({
    where: {
      AND: [
        { recurringNextOccurence_gte: dateFormat(now) },
        { recurringNextOccurence_lte: dateFormat(oneWeekFromNow) }
      ]
    },
    data: {
      isUpnext: true
    }
  });

  console.log("Done recurring task job");
  return true;
};
