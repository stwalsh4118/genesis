import { useEffect, useState } from "react";

export const Heatmap: React.FC = () => {
  const [dates, setDates] = useState<(Date | null)[][]>(
    groupDatesByWeek(getDatesPreviousYear(), true)
  );

  useEffect(() => {
    console.log("DATES", dates);
  }, [dates]);

  return (
    <>
      <div className="flex h-full w-full flex-col flex-wrap gap-1 bg-sage-400/20 px-10 pt-[5.5rem] pb-8">
        {/* {Array.from(Array(365).keys()).map((i) => {
          return <div key={i} className="h-6 w-6 bg-sage-400"></div>;
        })} */}
        {dates.map((week, i) => {
          return (
            <div
              key={i}
              className="flex h-full flex-col-reverse flex-wrap gap-1"
            >
              {week.map((day, j) => {
                if (!day) return <div key={j} className="h-6 w-6"></div>;
                return (
                  <div
                    key={j}
                    className="h-6 w-6 bg-sage-400"
                    title={day.toDateString()}
                  ></div>
                );
              })}
            </div>
          );
        })}
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

const getDatesPreviousYear = () => {
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
      groupedDates.push([]);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    groupedDates[groupedDates.length - 1]?.push(date!);
  }

  if (fillLastWeek) {
    groupedDates[groupedDates.length - 1] = [
      ...Array.from(
        Array(7 - groupedDates[groupedDates.length - 1]!.length).keys()
      ).map(() => {
        return null;
      }),
      ...groupedDates[groupedDates.length - 1]!,
    ];
  }

  return groupedDates;
};
