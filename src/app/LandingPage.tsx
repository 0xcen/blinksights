import { Button } from "~/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session, status } = useSession();

  return (
    <section className="w-full">
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="absolute inset-x-0  -z-10 transform-gpu overflow-hidden blur-3xl "
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-block mb-4 items-center rounded-lg bg-muted px-3 py-1 text-sm">
                Analytics
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Analytics for Blinks that convert
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Get deep insights on your Blinks to make data-driven decisions and drive your business forward.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                loading={status === "loading"}
                onClick={() => {
                  void signIn("google");
                }}
              >
                Sign Up
              </Button>
              </div>
            </div>
            <img
              src="/full-dashboard.jpg"
              alt="Screenshot of the Blinksights dashboard"
              className="w-full h-auto mt-16 shadow-top rounded-xl"
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
        </div>
      </div>
    </section>
  );
}
