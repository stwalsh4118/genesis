import {
  type EventData,
  type PagesReadEventData,
} from "@/server/api/routers/events";
import { type Event } from "@prisma/client";

//gets dates bewteen two dates
export const getDatesBetween = (startDate: Date, endDate: Date) => {
  const dates = [];

  // Strip hours minutes seconds etc.
  let currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  while (currentDate <= endDate) {
    dates.push(currentDate);

    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1 // Will increase month if over range
    );
  }

  return dates;
};

//uses getDatesBetween to get dates from previous year
export const getDatesPreviousYear = () => {
  const today = new Date();
  const lastYear = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );

  return getDatesBetween(lastYear, today).splice(1);
};

//groups the dates into the weeks they belong to
export const groupDatesByWeek = (dates: Date[], fillLastWeek: boolean) => {
  const groupedDates = [[]] as (Date | null)[][];
  const weekStart = 0; // 0 === Sunday

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    if (date?.getDay() === weekStart) {
      groupedDates[groupedDates.length - 1]?.reverse();
      groupedDates.push([]);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    groupedDates[groupedDates.length - 1]?.push(date!);
  }

  if (fillLastWeek) {
    groupedDates[groupedDates.length - 1] = [
      ...groupedDates[groupedDates.length - 1]!,
      ...Array.from(
        Array(7 - groupedDates[groupedDates.length - 1]!.length).keys()
      ).map(() => {
        return null;
      }),
    ];

    groupedDates[groupedDates.length - 1]?.reverse();
  }

  return groupedDates;
};

//gets the previous months in correct order
export const populateMonths = (dates: (Date | null)[][]) => {
  const months = [] as string[];

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i]![dates[i]!.length - 1];
    if (!date) continue;

    const month = date.toLocaleString("default", { month: "long" });
    if (!months.includes(month)) {
      months.push(month);
    }
  }

  months.push(new Date().toLocaleString("default", { month: "long" }));

  return months;
};

//groups events into the days they show up
export const groupEventsByDay = (events: Event[]): Map<string, Event[]> => {
  const groupedEventMap = new Map<string, Event[]>();

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (!event) continue;

    const dateString = new Date(event.createdAt).toISOString().split("T")[0];

    if (!dateString) continue;

    if (groupedEventMap.has(dateString)) {
      groupedEventMap.get(dateString)?.push(event);
    } else {
      groupedEventMap.set(dateString, [event]);
    }
  }

  return groupedEventMap;
};

//aggregates the pages read for each day
export const aggregatePagesRead = (
  groupedEventMap: Map<string, Event[]>
): Map<string, number> => {
  const aggregatedEventMap = new Map<string, number>();

  for (const [date, events] of groupedEventMap) {
    const onlyPagesReadEvents = events.filter(
      (event) =>
        (event.eventData as unknown as EventData).eventType === "pages_read"
    );

    const pagesRead = onlyPagesReadEvents.reduce((acc, event) => {
      return acc + (event.eventData as unknown as PagesReadEventData).pagesRead;
    }, 0);
    aggregatedEventMap.set(date, pagesRead);
  }

  return aggregatedEventMap;
};

//generates the heatmap color for each day based on the number of pages read
export const generateHeatmapColor = (pagesRead: number) => {
  if (pagesRead === 0) return "bg-sage-300";
  if (pagesRead <= 25) return "bg-sage-400";
  if (pagesRead <= 50) return "bg-sage-500";
  if (pagesRead <= 75) return "bg-sage-600";
  if (pagesRead <= 200) return "bg-sage-700";
  if (pagesRead > 200) return "bg-sage-800";

  console.log("GENERATING HEATMAP COLOR", pagesRead);
  return "bg-sage-300";
};
