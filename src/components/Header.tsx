"use client";
import { Search, CircleUser, Menu, Link } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import MobileNav from "~/components/MobileNav";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginDialog from "./LoginDialog";
import OnboardingDialog from "./OnboardingDialog";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log("🚀 ~ Header ~ session:", session);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
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
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        {session?.user ? (
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Login</DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      <LoginDialog open={!session?.user} />
      <OnboardingDialog open={true} />
    </header>
  );
}
