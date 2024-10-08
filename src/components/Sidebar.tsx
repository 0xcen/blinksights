import Link from "next/link";
import { Bell, ChartSpline } from "lucide-react";
import { Button } from "~/components/ui/button";
import NavLink from "./NavLink";
import UpgradeCard from "./UpgradeCard";
import { navLinks } from "~/config/nav";
import Logo from "./Logo";

export default function Sidebar() {
  return (
    <div className="hidden border-r md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/">
            <Logo />
          </Link>
          {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button> */}
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <UpgradeCard />
        </div>
      </div>
    </div>
  );
}
