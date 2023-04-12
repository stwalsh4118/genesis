import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { type Event } from "@prisma/client";
import {
  aggregatePagesRead,
  generateHeatmapColor,
  getDatesPreviousYear,
  groupDatesByWeek,
  groupEventsByDay,
  populateMonths,
} from "@/utils/dashboard_utils";

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
    if (dates) {
      setMonths([...populateMonths(dates)]);
    }
  }, [dates]);

  useEffect(() => {
    if (events) {
      const groupedEvents = groupEventsByDay(events);
      const aggregatedPages = aggregatePagesRead(groupedEvents);
      setPagesRead(aggregatedPages);
    }
  }, [events]);

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
