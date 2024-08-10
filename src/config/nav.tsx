import { Home, Eye, BookOpen } from "lucide-react";

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
    badge: "6",
  },
  {
    href: "/docs",
    icon: <BookOpen className="h-4 w-4" />,
    label: "Docs",
  },
];
