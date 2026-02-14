import { getDashboardStats, getRecentTransactions } from "@/actions/dashboard-actions";
import { TransactionList } from "@/components/features/transaction-list";
import { ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const recentTransactions = await getRecentTransactions(5);

    return (
        <div className="space-y-6">

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Net Balance - Large Primary Card */}
                <div className="card-balance relative overflow-hidden group hover:shadow-md transition-all lg:col-span-1">
                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <Wallet className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-xs font-black text-foreground/70 uppercase tracking-widest">Net Balance</span>
                        </div>
                        <div className="space-y-0.5">
                            <div className="text-3xl font-black text-foreground">₹{stats.netBalance.toLocaleString("en-IN")}</div>
                            <div className="flex items-center gap-2 text-xs font-bold text-primary">
                                <TrendingUp className="h-3 w-3" />
                                +12.5% this month
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Received - Incoming Card */}
                <div className="card-incoming flex flex-col justify-between group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-incoming uppercase tracking-widest opacity-80">Incoming</span>
                            <div className="text-2xl font-black text-foreground">₹{stats.totalIncoming.toLocaleString("en-IN")}</div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-incoming flex items-center justify-center text-incoming">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-incoming flex items-center gap-1 uppercase tracking-tighter">
                        Growing steadily
                    </div>
                </div>

                {/* Total Paid - Outgoing Card */}
                <div className="card-outgoing flex flex-col justify-between group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-outgoing uppercase tracking-widest opacity-80">Outgoing</span>
                            <div className="text-2xl font-black text-foreground">₹{stats.totalOutgoing.toLocaleString("en-IN")}</div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-outgoing flex items-center justify-center text-outgoing">
                            <TrendingDown className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-outgoing flex items-center gap-1 uppercase tracking-tighter">
                        Controlled spending
                    </div>
                </div>

            </div>

            {/* Recent Activity Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Recent Activity</h2>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Latest property transactions</p>
                    </div>
                    <Link href="/dashboard/transactions" className="bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        View All
                    </Link>
                </div>

                <div className="card-premium">
                    <TransactionList transactions={JSON.parse(JSON.stringify(recentTransactions))} />
                </div>
            </div>
        </div>
    );
}
