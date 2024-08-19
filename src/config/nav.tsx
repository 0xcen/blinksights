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
  // {
  //   href: "/settings",
  //   icon: <GearIcon className="h-4 w-4" />,
  //   label: "Settings",
  // },
  {
    href: "https://kopply.notion.site/Blinksights-SDK-Integration-Guide-b1cfbf885ac047e2b4ce1ce225951bf3?pvs=4",
    icon: <BookOpen className="h-4 w-4" />,
    label: "Docs",
  },
];
