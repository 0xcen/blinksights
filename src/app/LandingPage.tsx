import { Button } from "~/components/ui/button";
import { signIn, useSession } from "next-auth/react";

const stats = [
  { id: 1, name: 'Events Tracked', value: '2,000+' },
  { id: 2, name: 'Flat platform fee', value: '3%' },
  { id: 3, name: 'Uptime guarantee', value: '99.9%' },
  { id: 4, name: 'Paid out to creators', value: '$70M' },
]

// const renderStats = () => {
//   return (
//     <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
//     {/* <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
//       <h2 className="text-base font-semibold leading-8 text-indigo-400">Our track record</h2>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
//         Trusted by thousands of developers&nbsp;worldwide
//       </p>
//       <p className="mt-6 text-lg leading-8 text-gray-300">
//         Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
//         dolor cupiditate blanditiis ratione.
//       </p>
//     </div> */}
//     <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
//       {stats.map((stat) => (
//         <div key={stat.id} className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
//           <dt className="text-sm leading-6">{stat.name}</dt>
//           <dd className="order-first text-3xl font-semibold tracking-tight">{stat.value}</dd>
//         </div>
//       ))}
//     </dl>
//   </div>
//   )
// }


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
                Insights for Blinks that convert
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
            {/* {renderStats()} */}
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
