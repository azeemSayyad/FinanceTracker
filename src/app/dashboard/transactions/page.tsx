import { getRecentTransactions, getDashboardStats } from "@/actions/dashboard-actions";
import { TransactionList } from "@/components/features/transaction-list";
import { Plus, Filter, Search, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { TransactionType } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>;
}) {
    const { type } = await searchParams;
    const filterType = type as TransactionType | undefined;

    const transactions = await getRecentTransactions(100, filterType);
    const stats = await getDashboardStats();

    return (
        <div className="space-y-10">
            {/* Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="card-balance flex flex-col gap-1 py-3 px-4">
                    <span className="text-[10px] font-black text-foreground/70 uppercase tracking-widest flex items-center gap-2">
                        <Wallet className="h-3 w-3" /> Net Balance
                    </span>
                    <div className="text-2xl font-black text-foreground">₹{stats.netBalance.toLocaleString("en-IN")}</div>
                </div>
                <div className="card-incoming flex flex-col gap-1 py-3 px-4">
                    <span className="text-[10px] font-black text-incoming uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="h-3 w-3" /> Incoming
                    </span>
                    <div className="text-2xl font-black text-incoming">₹{stats.totalIncoming.toLocaleString("en-IN")}</div>
                </div>
                <div className="card-outgoing flex flex-col gap-1 py-3 px-4">
                    <span className="text-[10px] font-black text-outgoing uppercase tracking-widest flex items-center gap-2">
                        <TrendingDown className="h-3 w-3" /> Outgoing
                    </span>
                    <div className="text-2xl font-black text-outgoing">₹{stats.totalOutgoing.toLocaleString("en-IN")}</div>
                </div>

            </div>


            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl px- font-black tracking-tighter">Project Ledger</h1>
                        <p className="text-muted-foreground font-medium">Timeline of all property-related transactions</p>
                    </div>

                    {/* Filter Tabs / Segmented Control */}
                    <div className="bg-muted p-1.5 rounded-2xl flex items-center gap-1">
                        <Link
                            href="/dashboard/transactions"
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                                !type ? "bg-card text-foreground shadow-sm" : "hover:bg-card/50 text-muted-foreground"
                            )}
                        >
                            All
                        </Link>
                        <Link
                            href="/dashboard/transactions?type=incoming"
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                                type === "incoming" ? "bg-card text-foreground shadow-sm" : "hover:bg-card/50 text-muted-foreground"
                            )}
                        >
                            Incoming
                        </Link>
                        <Link
                            href="/dashboard/transactions?type=outgoing"
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                                type === "outgoing" ? "bg-card text-foreground shadow-sm" : "hover:bg-card/50 text-muted-foreground"
                            )}
                        >
                            Outgoing
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="Search by notes, property ID, details..."
                        className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>

                <div className="mt-8">
                    <TransactionList transactions={JSON.parse(JSON.stringify(transactions))} />
                </div>
            </div>
        </div>
    );
}

// Helper to keep code clean since cn is often used
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ");
}
