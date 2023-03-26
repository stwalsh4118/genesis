import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setLoaded(true);
      // console.log("loaded");
    }, 500);
  }, [session]);

  if (!session) return <></>;

  const layout = [
    { i: "a", x: 0, y: 0, w: 2, h: 2 },
    { i: "b", x: 2, y: 0, w: 2, h: 2 },
    { i: "c", x: 4, y: 0, w: 2, h: 2 },

    { i: "d", x: 0, y: 2, w: 6, h: 4 },
    { i: "e", x: 0, y: 7, w: 8, h: 4 },
    { i: "f", x: 8, y: 7, w: 4, h: 4 },
    { i: "h", x: 7, y: 0, w: 6, h: 6 },
  ];

  return (
    <>
      {loaded ? (
        <div className="max-w-full grow overflow-hidden bg-sage-100 p-8">
          <ResponsiveGridLayout
            className="layout"
            layouts={{
              lg: layout,
            }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={80}
          >
            <div className="bg-sage-300" key="a">
              a
            </div>
            <div className="bg-sage-300" key="b">
              b
            </div>
            <div className="bg-sage-300" key="c">
              c
            </div>
            <div className="bg-sage-300" key="d">
              d
            </div>
            <div className="bg-sage-300" key="e">
              e
            </div>
            <div className="bg-sage-300" key="f">
              f
            </div>
            <div className="bg-sage-300" key="h">
              h
            </div>
          </ResponsiveGridLayout>
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;
