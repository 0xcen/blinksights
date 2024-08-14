import { HydrateClient } from "~/trpc/server";
import View from "./View";

const page = () => {
  return (
    <HydrateClient>
      <View />
    </HydrateClient>
  );
};

export default page;
