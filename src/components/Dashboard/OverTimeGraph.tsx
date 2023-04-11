import { api } from "@/utils/api";
import { groupEventsByDay, aggregatePagesRead } from "@/utils/dashboard_utils";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const OverTimeGraph: React.FC = () => {
  const { data: events } = api.events.getEvents.useQuery();
  const [graphData, setGraphData] = useState<
    { name: string; dataPoint: number }[]
  >([]);

  useEffect(() => {
    if (events) {
      const groupedEvents = groupEventsByDay(events);
      const aggregatedPages = aggregatePagesRead(groupedEvents);

      const sumDataOverTime = (data: Map<string, number>) => {
        let sum = 0;
        const result = [];
        for (const [key, value] of data) {
          sum += value;
          result.push({
            name: key,
            dataPoint: sum,
          });
        }
        return result;
      };

      setGraphData(sumDataOverTime(aggregatedPages));
    }
  }, [events]);

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(97 109 77)" />
          <XAxis dataKey="name" stroke="rgb(97 109 77)" />
          <YAxis stroke="rgb(97 109 77)" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="dataPoint"
            activeDot={{ r: 8 }}
            dot={false}
            stroke="rgb(38 43 30)"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};
