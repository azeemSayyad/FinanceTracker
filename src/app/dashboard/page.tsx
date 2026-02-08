import { getDashboardStats, getRecentTransactions } from "@/actions/dashboard-actions";
import { TransactionList } from "@/components/features/transaction-list";
import { ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const recentTransactions = await getRecentTransactions(5);

    return (
        <div className="space-y-10">
            {/* Action Buttons Header */}
            <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 bg-white dark:bg-card border border-border text-foreground px-6 py-3 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all">
                    <div className="h-6 w-6 bg-muted rounded-lg flex items-center justify-center">
                        <Plus className="h-4 w-4" />
                    </div>
                    Worker Pay
                </button>
                <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all">
                    <div className="h-6 w-6 bg-white/20 rounded-lg flex items-center justify-center text-white">
                        <Plus className="h-4 w-4" />
                    </div>
                    Client Pay
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Net Balance - Large Primary Card */}
                <div className="bg-primary rounded-[2.5rem] p-2 text-white relative overflow-hidden group shadow-2xl shadow-primary/20 lg:col-span-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Net Balance</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-4xl font-black">₹{stats.netBalance.toLocaleString("en-IN")}</div>
                            <div className="flex items-center gap-2 text-sm font-bold text-white/80">
                                <TrendingUp className="h-4 w-4" />
                                +12.5% from last month
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Received - Circular Card */}
                <div className="bg-card border border-border rounded-[2.5rem] p-2 flex flex-col justify-between group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Incoming</span>
                            <div className="text-3xl font-black text-foreground">₹{stats.totalIncoming.toLocaleString("en-IN")}</div>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs font-bold text-success flex items-center gap-1">
                        Growing steadily
                    </div>
                </div>

                {/* Total Paid - Circular Card */}
                <div className="bg-card border border-border rounded-[2.5rem] p-2 flex flex-col justify-between group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Outgoing</span>
                            <div className="text-3xl font-black text-foreground">₹{stats.totalOutgoing.toLocaleString("en-IN")}</div>
                        </div>
                        <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20">
                            <TrendingDown className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs font-bold text-destructive flex items-center gap-1">
                        Controlled spending
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
                        <p className="text-sm font-medium text-muted-foreground">Monitor your latest property transactions</p>
                    </div>
                    <Link href="/dashboard/transactions" className="bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                        View All
                    </Link>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-[2.5rem] p-3">
                    <TransactionList transactions={JSON.parse(JSON.stringify(recentTransactions))} />
                </div>
            </div>
        </div>
    );
}
