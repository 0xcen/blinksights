"use client";
import { CircleUser, Menu } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MobileNav from "~/components/MobileNav";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import Logo from "./Logo";
import OnboardingDialog from "./OnboardingDialog";
import { docsUrl } from "~/lib/constants";
import { supportEmail } from "~/lib/constants";
import { Switch } from "~/components/ui/switch";
import { useDevModeStore } from "../store/devModeStore";


export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const devMode = useDevModeStore((state: { devMode: boolean }) => state.devMode);
  const toggleDevMode = useDevModeStore((state: { toggleDevMode: () => void }) => state.toggleDevMode);


  if (!session?.user) {
    return (
      <header className="flex h-14 w-full items-center justify-between gap-4 border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Link target="_blank" href={docsUrl}>
            <Button variant="link">Docs</Button>
          </Link>
        <Button
          loading={status === "loading"}
          onClick={() => {
            void signIn("google");
          }}
        >
            Login
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <MobileNav />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        {/* <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form> */}
      </div>
      <div className="flex items-center space-x-2 mx-4">
          <Switch checked={devMode} onCheckedChange={toggleDevMode} />
          <p>Test Mode</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            onClick={(e) => {
              e.preventDefault();
              if (!session?.user) {
                router.push("/login");
              }
            }}
          >
            {session?.user.image ? (
              <Image
                src={session?.user.image}
                width={36}
                height={36}
                className="rounded-full"
                alt="user icon"
              />
            ) : (
              <CircleUser className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        {session?.user ? (
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <Link href="/settings">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link> */}
            <Link href={`mailto:${supportEmail}`}>
              <DropdownMenuItem>Support</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <Link href="/">
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Login</DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      {/* <LoginDialog open={!session?.user && status === "unauthenticated"} /> */}
      <OnboardingDialog open={!!session?.user && !session?.user?.orgId} />
    </header>
  );
}
