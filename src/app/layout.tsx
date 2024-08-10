import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import Sidebar from "~/components/Sidebar";
import Header from "~/components/Header";
import { TRPCReactProvider } from "../trpc/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blinksights",
  description: "Blink Analytics. Insights for blinks that convert",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCReactProvider>
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
              <Header />
              <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
              </main>
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
