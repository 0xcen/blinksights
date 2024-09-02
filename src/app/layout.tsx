"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { Manrope } from "next/font/google";
import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";
import "~/styles/globals.css";
import { Toaster } from "../components/ui/toaster";
import { cn } from "../lib/utils";
import { TRPCReactProvider } from "../trpc/react";
import { Analytics } from "@vercel/analytics/react";

const fontHeading = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex w-screen flex-1 flex-col gap-4 p-4 md:w-auto lg:gap-6 lg:p-6">
          {children}
          <Toaster />
        </main>
      </div>
    </div>
  );
}

function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
  const network =
    process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl("mainnet-beta");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center">
        <ConnectionProvider endpoint={network}>
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
        <Toaster />
      </main>
    </div>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return session ? (
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  ) : (
    <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <TRPCReactProvider>
          <SessionProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SessionProvider>
        </TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
