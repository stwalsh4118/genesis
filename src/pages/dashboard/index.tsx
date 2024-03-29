import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import { LockOpenIcon, LockClosedIcon } from "@heroicons/react/24/solid";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { api } from "@/utils/api";
import { Heatmap } from "@/components/Dashboard/Heatmap";
import { OverTimeGraph } from "@/components/Dashboard/OverTimeGraph";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type Layout = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}[];

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [locked, setLocked] = useState(true);
  const [layout, setLayout] = useState<Layout>([
    { i: "a", x: 0, y: 0, w: 2, h: 2 },
    { i: "b", x: 2, y: 0, w: 2, h: 2 },
    { i: "c", x: 4, y: 0, w: 2, h: 2 },

    { i: "d", x: 0, y: 2, w: 6, h: 4 },
    { i: "e", x: 0, y: 6, w: 12, h: 4 },
    { i: "f", x: 3, y: 2, w: 3, h: 4 },
    { i: "h", x: 7, y: 0, w: 6, h: 6 },
  ]);

  const { data: averageRating } = api.user_dashboard.averageRating.useQuery();
  const { data: finishedBooks } =
    api.user_dashboard.totalBooksFinished.useQuery();
  const { data: pagesTotal } = api.user_dashboard.totalPagesRead.useQuery();
  const { data: pagesOverTime } =
    api.user_dashboard.pagesReadOverTime.useQuery();
  const { data: genresRead } = api.user_dashboard.genresRead.useQuery();
  const { data: userLayout } = api.user_dashboard.getUserLayout.useQuery();
  const updateLayout = api.user_dashboard.updateUserLayout.useMutation();

  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  useEffect(() => {
    if (userLayout) {
      setLayout(JSON.parse(userLayout) as Layout);
    } else {
      setLayout([
        { i: "a", x: 0, y: 0, w: 2, h: 2 },
        { i: "b", x: 2, y: 0, w: 2, h: 2 },
        { i: "c", x: 4, y: 0, w: 2, h: 2 },

        { i: "d", x: 0, y: 2, w: 6, h: 4 },
        { i: "e", x: 0, y: 6, w: 12, h: 4 },
        { i: "f", x: 3, y: 2, w: 3, h: 4 },
        { i: "h", x: 7, y: 0, w: 6, h: 6 },
      ]);
    }
  }, [userLayout]);

  useEffect(() => {
    setInterval(() => {
      setLoaded(true);
    }, 700);
  }, [session]);

  if (!session) return <></>;

  return (
    <>
      {loaded ? (
        <div className="flex max-w-full grow select-none flex-col overflow-hidden bg-sage-100">
          <div className="flex h-10 w-full items-center gap-2 px-10">
            <div
              className="button h-6 w-6 text-sage-800"
              onClick={() => setLocked(!locked)}
            >
              {locked ? (
                <LockClosedIcon className="h-full w-full"></LockClosedIcon>
              ) : (
                <LockOpenIcon className="ml-[3px] h-full w-full"></LockOpenIcon>
              )}
            </div>
            <div
              className="button rounded-sm bg-sage-400 px-1 shadow-sm"
              onClick={() => {
                updateLayout.mutate(JSON.stringify(layout));
              }}
            >
              Save
            </div>
          </div>
          <div className="flex min-h-[calc(100vh-2.5rem)] max-w-full grow select-none flex-col overflow-x-hidden overflow-y-scroll bg-sage-100 px-8">
            <ResponsiveGridLayout
              className="layout"
              layouts={{
                lg: layout,
              }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={80}
              isDraggable={!locked}
              isResizable={!locked}
              compactType={"vertical"}
              autoSize={true}
              maxRows={12}
              onLayoutChange={(layout) => setLayout(layout)}
            >
              <div
                className="flex flex-col rounded-sm border-[1px] border-sage-400/30 bg-sage-200 p-2 shadow-md"
                key="a"
              >
                <div className="h-6 w-full">Total Pages Read</div>

                <div
                  className={`flex grow items-center justify-center ${
                    pagesTotal ? "text-5xl" : "text-xl"
                  } font-bold text-sage-800`}
                >
                  {pagesTotal ? pagesTotal : "Read some pages!"}
                </div>
              </div>
              <div
                className="flex flex-col rounded-sm border-[1px] border-sage-400/30 bg-sage-200 p-2 shadow-md"
                key="b"
              >
                <div className="h-6 w-full">Total Finished Books</div>

                <div
                  className={`flex grow items-center justify-center ${
                    finishedBooks ? "text-5xl" : "text-xl"
                  } font-bold text-sage-800`}
                >
                  {finishedBooks ? finishedBooks : "Read some books!"}
                </div>
              </div>
              <div
                className="flex flex-col rounded-sm border-[1px] border-sage-400/30 bg-sage-200 p-2 shadow-md"
                key="c"
              >
                <div className="h-6 w-full">Average Rating</div>

                <div
                  className={`flex grow items-center justify-center ${
                    averageRating ? "text-5xl" : "text-xl"
                  } font-bold text-sage-800`}
                >
                  {averageRating ? averageRating : "Rate some books!"}
                </div>
              </div>
              <div
                className="flex flex-col rounded-sm border-[1px] border-sage-400/30 bg-sage-200 p-2 shadow-md"
                key="d"
              >
                {genresRead ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={genresRead}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgb(38 43 30)"
                      />
                      <XAxis dataKey="name" stroke="rgb(38 43 30)" />
                      <YAxis stroke="rgb(38 43 30)" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="rgb(97 109 77)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-grow items-center justify-center text-xl font-bold text-sage-800">
                    Read some books!
                  </div>
                )}
              </div>
              <div
                className="flex flex-col rounded-sm border-[1px] border-sage-400/30 bg-sage-200 p-2 shadow-md"
                key="e"
              >
                <Heatmap></Heatmap>
              </div>
              {/* <div
                className="flex flex-col rounded-sm border-[1px] border-sage-400/30 bg-sage-200 p-2 shadow-md"
                key="f"
              ></div> */}
              <div
                className="flex flex-col gap-8 rounded-sm border-[1px] border-sage-400/30 bg-sage-200 p-2 shadow-md"
                key="h"
              >
                <div className="h-6 w-full">Pages Read Over Time</div>
                <div className="flex h-[calc(100%-4rem)] w-full items-center justify-center">
                  <OverTimeGraph></OverTimeGraph>
                </div>
              </div>
            </ResponsiveGridLayout>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;
