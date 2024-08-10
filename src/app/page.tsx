import SignInButton from "~/components/SignInButton";
import { HydrateClient } from "~/trpc/server";

const page = () => {
  return (
    <HydrateClient>
      <div>Hello world</div>
      <SignInButton />
    </HydrateClient>
  );
};

export default page;
