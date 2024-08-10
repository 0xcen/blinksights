import Link from "next/link";
import NavLink from "~/components/NavLink";
import UpgradeCard from "~/components/UpgradeCard";

import { Bell, ChartSpline } from "lucide-react";
import { Button } from "~/components/ui/button";
import { navLinks } from "~/config/nav";

export default function MobileNav() {
  return (
    <>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ChartSpline className="h-6 w-6" />
          <span>Blinksights</span>
        </Link>
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <nav className="grid gap-2 px-2 py-4 text-sm font-medium">
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            badge={link.badge}
          />
        ))}
      </nav>
      <div className="mt-auto">
        <UpgradeCard />
      </div>
    </>
  );
}
