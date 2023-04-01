import { PagesReadEventData } from "@/server/api/routers/events";
import { api } from "@/utils/api";
import { type Event } from "@prisma/client";
import { useEffect, useState } from "react";

interface HeatmapProps {
  Events?: Event;
}

export const Heatmap: React.FC<HeatmapProps> = ({ Events }) => {
  const [dates, setDates] = useState<(Date | null)[][]>(
    groupDatesByWeek(getDatesPreviousYear(), true)
  );
  const [months, setMonths] = useState<string[]>([]);
  const [pagesRead, setPagesRead] = useState<Map<string, number>>(new Map());
  const generateFakeEvents = api.events.addFakeEvents.useMutation();
  const { data: events } = api.events.getEvents.useQuery();

  useEffect(() => {
    if (events) {
      const groupedEvents = groupEventsByDay(events);
      const aggregatedPages = aggregatePagesRead(groupedEvents);
      setPagesRead(aggregatedPages);
    }
  }, [events]);

  useEffect(() => {
    if (dates) {
      setMonths([...populateMonths(dates)]);
    }
  }, [dates]);

  useEffect(() => {
    console.log("MONTHS", months);
  }, [months]);

  useEffect(() => {
    console.log("DATES", dates);
  }, [dates]);

  return (
    <>
      <div
        className="flex h-full w-full flex-col items-center justify-end gap-4 bg-sage-400/20 px-4"
        // onClick={() => void generateFakeEvents.mutate()}
      >
        <div className="flex h-4 w-full shrink-0 text-sage-800">
          {months.map((month, i) => {
            return (
              <div
                key={i}
                className="flex h-full w-1/12 items-center justify-start"
              >
                {month}
              </div>
            );
          })}
        </div>
        <div className="flex h-48 w-full shrink flex-col flex-wrap gap-1 ">
          {dates.map((week, i) => {
            return (
              <div
                key={i}
                className="flex h-full flex-col-reverse flex-wrap gap-1"
              >
                {week.map((day, j) => {
                  if (!day || !pagesRead) {
                    return <div key={j} className="h-6 w-6"></div>;
                  }

                  const hasRead = pagesRead.get(
                    day.toISOString().split("T")[0]!
                  );

                  return (
                    <div
                      key={j}
                      className={`h-6 w-6 rounded-sm border-[1px] border-sage-800/20 ${generateHeatmapColor(
                        hasRead
                          ? pagesRead.get(day.toISOString().split("T")[0]!)!
                          : 0
                      )} shadow-sm`}
                      title={`${
                        pagesRead.get(day.toISOString().split("T")[0]!)! || 0
                      } Pages Read on ${day.toDateString()}`}
                    ></div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-1 self-end px-2 pb-2">
          <div>Less</div>
          <div className="h-3 w-3 rounded-sm border-[1px] border-sage-800/20 bg-sage-300"></div>
          <div className="h-3 w-3 rounded-sm border-[1px] border-sage-800/20 bg-sage-400"></div>
          <div className="h-3 w-3 rounded-sm border-[1px] border-sage-800/20 bg-sage-500"></div>
          <div className="h-3 w-3 rounded-sm border-[1px] border-sage-800/20 bg-sage-600"></div>
          <div className="h-3 w-3 rounded-sm border-[1px] border-sage-800/20 bg-sage-700"></div>
          <div className="h-3 w-3 rounded-sm border-[1px] border-sage-800/20 bg-sage-800"></div>
          <div>More</div>
        </div>
      </div>
    </>
  );
};

const getDatesBetween = (startDate: Date, endDate: Date) => {
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

export const getDatesPreviousYear = () => {
  const today = new Date();
  const lastYear = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );

  return getDatesBetween(lastYear, today).splice(1);
};

const groupDatesByWeek = (dates: Date[], fillLastWeek: boolean) => {
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

const populateMonths = (dates: (Date | null)[][]) => {
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

const aggregatePagesRead = (
  groupedEventMap: Map<string, Event[]>
): Map<string, number> => {
  const aggregatedEventMap = new Map<string, number>();

  for (const [date, events] of groupedEventMap) {
    const pagesRead = events.reduce((acc, event) => {
      return acc + (event.eventData as unknown as PagesReadEventData).pagesRead;
    }, 0);

    aggregatedEventMap.set(date, pagesRead);
  }

  return aggregatedEventMap;
};

const generateHeatmapColor = (pagesRead: number) => {
  if (pagesRead === 0) return "bg-sage-300";
  if (pagesRead <= 25) return "bg-sage-400";
  if (pagesRead <= 50) return "bg-sage-500";
  if (pagesRead <= 75) return "bg-sage-600";
  if (pagesRead <= 200) return "bg-sage-700";
  if (pagesRead > 200) return "bg-sage-800";

  return "bg-sage-300";
};
