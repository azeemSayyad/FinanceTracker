import { LayoutDashboard, Users, HardHat, ReceiptIndianRupee, Settings } from "lucide-react";

export const NAV_ITEMS = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Workers",
        href: "/dashboard/workers",
        icon: HardHat,
    },
    {
        title: "Clients",
        href: "/dashboard/clients",
        icon: Users,
    },
    {
        title: "Ledger",
        href: "/dashboard/transactions",
        icon: ReceiptIndianRupee,
    },
    {
        title: "Admin",
        href: "/dashboard/admin",
        icon: Settings,
        adminOnly: true,
    },
];
