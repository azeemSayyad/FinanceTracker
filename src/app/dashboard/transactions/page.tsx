import { getRecentTransactions, getDashboardStats } from "@/actions/dashboard-actions";
import { TransactionList } from "@/components/features/transaction-list";
import { Plus, Filter, Search, TrendingUp, TrendingDown, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
    const transactions = await getRecentTransactions(50);
    const stats = await getDashboardStats();

    return (
        <div className="space-y-10">
            {/* Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-3 rounded-[2rem] flex flex-col gap-2">
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Wallet className="h-3 w-3" /> Net Balance
                    </span>
                    <div className="text-3xl font-black">₹{stats.netBalance.toLocaleString("en-IN")}</div>
                </div>
                <div className="bg-success/5 border border-success/10 p-3 rounded-[2rem] flex flex-col gap-2">
                    <span className="text-xs font-black text-success uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="h-3 w-3" /> Incoming
                    </span>
                    <div className="text-3xl font-black text-success">₹{stats.totalIncoming.toLocaleString("en-IN")}</div>
                </div>
                <div className="bg-destructive/5 border border-destructive/10 p-2 rounded-[2rem] flex flex-col gap-2">
                    <span className="text-xs font-black text-destructive uppercase tracking-widest flex items-center gap-2">
                        <TrendingDown className="h-3 w-3" /> Outgoing
                    </span>
                    <div className="text-3xl font-black text-destructive">₹{stats.totalOutgoing.toLocaleString("en-IN")}</div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">Project Ledger</h1>
                        <p className="text-muted-foreground font-medium">Timeline of all property-related transactions</p>
                    </div>

                    {/* Filter Tabs / Segmented Control */}
                    <div className="bg-muted p-1.5 rounded-2xl flex items-center gap-1">
                        <button className="bg-card text-foreground px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-all">All</button>
                        <button className="hover:bg-card/50 text-muted-foreground px-6 py-2 rounded-xl text-sm font-bold transition-all">Incoming</button>
                        <button className="hover:bg-card/50 text-muted-foreground px-6 py-2 rounded-xl text-sm font-bold transition-all">Outgoing</button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="Search by notes, property ID, details..."
                        className="w-full bg-card border border-border rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>

                <div className="mt-8">
                    <TransactionList transactions={JSON.parse(JSON.stringify(transactions))} />
                </div>
            </div>

            {/* Floating Action Button */}
            <button className="fixed bottom-24 right-8 md:bottom-12 md:right-12 h-16 w-16 bg-primary text-white rounded-full shadow-[0_20px_40px_rgba(24,119,242,0.4)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50">
                <Plus className="h-8 w-8" />
            </button>
        </div>
    );
}
