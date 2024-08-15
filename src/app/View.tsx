"use client";
import { useSession } from "next-auth/react";
import Dashboard from "./Dashboard";
import LandingPage from "./LandingPage";

const View = () => {
  const { data: session } = useSession();
  return session ? <Dashboard /> : <LandingPage />;
};

export default View;
