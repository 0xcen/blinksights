import { HydrateClient } from "~/trpc/server";
import Dashboard from "./Dashboard";

const Page = () => {
  return (
    <HydrateClient>
      <Dashboard />
    </HydrateClient>
  );
};

export default Page;
