"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "~/components/ui/badge";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

export default function NavLink({ href, icon, label, badge }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseClasses =
    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all";
  const activeClasses = isActive
    ? "bg-muted text-primary"
    : "text-muted-foreground hover:text-primary";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${isActive ? activeClasses : ""}`}
    >
      {icon}
      {label}
      {badge && (
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          {badge}
        </Badge>
      )}
    </Link>
  );
}
