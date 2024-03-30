"use client";
import {
  LucideIcon,
  LayoutDashboard,
  BadgeDollarSign,
  CircleUserRound,
  Settings,
  WalletCards,
  CalendarDays,
  LandPlot,
  Users2,
  Medal,
  CircleDollarSign,
  Trophy,
} from "lucide-react";
import SidebarItem from "./item";



const items= [
  {
    name: "Dashboard",
    path: "/firstpage",
    icon: LayoutDashboard,
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: CalendarDays
  },
  {
    name: "Classes",
    path: "/classes",
    icon: LandPlot,
  },
  {
    name: "Coaches",
    path: "/coaches",
    icon: Users2,
  },
  {
    name: "Clients",
    path: "/players",
    icon: CircleUserRound,
  },
  {
    name: "Booking",
    path: "/matches",
    icon: Medal,
  },
  {
    name: "Tournaments",
    path: "/tournaments",
    icon: Trophy,
  },
  {
    name: "Billing",
    path: "/payment",
    icon: CircleDollarSign,
    items: [
      {
        name: "Clients",
        path: "/payment",
      },
      {
        name: "Coaches",
        path: "/payment/coaches",
      },
    ],
  },
];

const Sidebar = () => {
  return (

    <div className="fixed top-0 left-0 min-h-screen w-64 bg-white shadow-lg  p-4">
      <div className="flex flex-col space-y-10 w-full">
        <img className="h-50 w-fit" src="/logo-expanded.png" alt="Logo" />
        <div className="flex flex-col space-y-2">
          {items.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;