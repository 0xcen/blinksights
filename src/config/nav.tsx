import { GearIcon } from "@radix-ui/react-icons";
import { Home, Eye, BookOpen, KeyRoundIcon } from "lucide-react";

export const navLinks = [
  {
    href: "/",
    icon: <Home className="h-4 w-4" />,
    label: "Dashboard",
  },
  {
    href: "/blinks",
    icon: <Eye className="h-4 w-4" />,
    label: "Blinks",
  },
  {
    href: "/organization",
    icon: <KeyRoundIcon className="h-4 w-4" />,
    label: "API Key",
  },
  {
    href: "/settings",
    icon: <GearIcon className="h-4 w-4" />,
    label: "Settings",
  },
  {
    href: "/docs",
    icon: <BookOpen className="h-4 w-4" />,
    label: "Docs",
  },
];
