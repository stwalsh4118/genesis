import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { Layout } from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
          <Analytics></Analytics>
        </Layout>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
