"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "./nav-config";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Moon, Sun, Search, Bell, Menu, ReceiptIndianRupee } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0 z-40 transition-all">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <ReceiptIndianRupee className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">
                            ContractorPay
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 relative z-10", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                                <span className="font-semibold relative z-10">{item.title}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                        <div className="flex items-center gap-3">
                            <Avatar name="Sarah Jenkins" size="sm" />
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold truncate">Sarah Jenkins</p>
                                <p className="text-[10px] text-muted-foreground truncate">Admin Account</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="h-20 sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8 transition-all">
                    <div className="flex items-center gap-4 md:hidden">
                        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <ReceiptIndianRupee className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                        <p className="text-sm font-medium">Good Morning,</p>
                        <p className="text-sm font-bold text-foreground">Sarah Jenkins</p>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button className="p-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-all shadow-sm">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted relative transition-all shadow-sm">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-card" />
                        </button>
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-all shadow-sm"
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <div className="h-10 w-10 hidden md:block">
                            <Avatar name="Sarah Jenkins" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 pb-10 md:pb-8">
                    <div className="max-w-7xl mx-auto p-2 md:p-4">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden bg-card/85 backdrop-blur-xl border border-border/50 shadow-2xl rounded-[2rem] px-6 py-3 transition-all">
                <nav className="flex justify-between items-center gap-4">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center transition-all duration-300",
                                    isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-2xl transition-all",
                                    isActive && "bg-primary shadow-lg shadow-primary/40 text-white"
                                )}>
                                    <item.icon className="h-5 w-5" />
                                </div>
                                {isActive && (
                                    <motion.span
                                        layoutId="mobile-nav-label"
                                        className="text-[8px] font-bold mt-1"
                                    >
                                        {item.title}
                                    </motion.span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    );
}
