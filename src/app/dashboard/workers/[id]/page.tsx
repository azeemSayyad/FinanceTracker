import { getWorkerById, updateWorker, deleteWorker } from "@/actions/worker-actions";
import { getTransactionsByWorker } from "@/actions/transaction-actions";
import { TransactionList } from "@/components/features/transaction-list";
import { AddTransactionButton } from "@/components/features/add-transaction-button";
import { TransactionType } from "@/lib/types";
import { notFound } from "next/navigation";
import { Phone, Briefcase, Wallet, Calendar, ArrowLeft, TrendingUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ProfileActions } from "@/components/features/profile-actions";
import Link from "next/link";

export default async function WorkerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const worker = await getWorkerById(id);

    if (!worker) return notFound();

    const transactions = await getTransactionsByWorker(id);
    const totalPaid = transactions
        .filter(t => t.type === TransactionType.OUTGOING)
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const onEdit = async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
        "use server";
        const res = await updateWorker(id, formData);
        return { success: res.success || false, error: res.error };
    };

    const onDelete = async (id: string): Promise<{ success: boolean; error?: string }> => {
        "use server";
        const res = await deleteWorker(id);
        return { success: res.success || false, error: res.error };
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/workers" className="p-2 rounded-xl hover:bg-muted transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h2 className="text-xl font-black tracking-tight text-main">Worker Profile</h2>
                </div>
                <ProfileActions
                    id={worker.id}
                    name={worker.name}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    editModalTitle="Edit Worker Profile"
                    deleteMessage={`Are you sure you want to delete ${worker.name}? This will also delete all their transactions.`}
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">Full Name</label>
                            <input
                                name="name"
                                defaultValue={worker.name}
                                required
                                className="w-full bg-secondary border-2 border-border/50 rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all placeholder:text-muted-foreground/30 text-foreground"
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">Phone</label>
                                <input
                                    name="phone"
                                    defaultValue={worker.phone}
                                    className="w-full bg-secondary border-2 border-border/50 rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all placeholder:text-muted-foreground/30 text-foreground"
                                    placeholder="9876543210"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">Category</label>
                                <input
                                    name="category"
                                    defaultValue={worker.category}
                                    required
                                    className="w-full bg-secondary border-2 border-border/50 rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all placeholder:text-muted-foreground/30 text-foreground"
                                    placeholder="e.g. Plumber"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">Notes</label>
                            <textarea
                                name="notes"
                                defaultValue={worker.notes || ""}
                                className="w-full bg-secondary border-2 border-border/50 rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all min-h-[120px] placeholder:text-muted-foreground/30 text-foreground"
                                placeholder="Worker details..."
                            />
                        </div>
                    </div>
                </ProfileActions>
            </div>

            {/* Header / Profile Card */}
            <div className="relative overflow-hidden card-premium p-6 md:p-10 border-none shadow-xl bg-gradient-to-br from-card to-muted/20">
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                    {/* Compact row for mobile, traditional for desktop */}
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-8 w-full md:w-auto">
                        <div className="relative shrink-0">
                            <Avatar name={worker.name} size="lg" className="h-20 w-20 md:h-32 md:w-32 text-2xl md:text-3xl shadow-2xl border-4 border-background" />
                        </div>

                        <div className="flex-1 text-left space-y-1 md:space-y-4">
                            <div>
                                <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-main mb-1">{worker.name}</h1>
                                <div className="flex flex-wrap items-center justify-start gap-2 md:gap-3">
                                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest px-2 md:px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                        {worker.category}
                                    </span>
                                    {worker.phone && (
                                        <span className="flex items-center gap-1.5 md:gap-2 text-[12px] md:text-sm font-bold text-muted">
                                            <Phone className="h-3 w-3 md:h-4 md:w-4" /> {worker.phone}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {worker.notes && (
                                <div className="bg-muted/30 p-3 md:p-4 rounded-xl md:rounded-2xl border border-border hidden md:inline-block max-w-md">
                                    <p className="text-[10px] md:text-xs font-bold text-muted/80 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <Calendar className="h-3 w-3" /> Worker Notes
                                    </p>
                                    <p className="text-[12px] md:text-sm text-main font-medium">{worker.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="w-full md:w-72 mt-4 md:mt-0">
                        <div className="card-outgoing p-6 space-y-4 shadow-lg border-orange-500/20">
                            <div className="flex items-center justify-between">
                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                    <Wallet className="h-5 w-5 text-orange-600" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 opacity-60">Total Paid Out</span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-black text-main">₹{totalPaid.toLocaleString("en-IN")}</div>
                                <div className="text-xs font-bold text-orange-600 opacity-80 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> Ready for next payout
                                </div>
                            </div>
                            <AddTransactionButton
                                workerId={worker.id}
                                defaultType={TransactionType.OUTGOING}
                                label="Record New Payment"
                                className="w-full btn-action py-3 justify-center shadow-orange-500/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />
            </div>

            {/* Ledger Section */}
            <div className="px-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black tracking-tight text-main">Payment History</h2>
                    <div className="h-px flex-1 bg-border/50 mx-6 hidden md:block" />
                    <span className="text-xs font-bold text-muted uppercase tracking-widest">{transactions.length} Transactions</span>
                </div>
                <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
                    <TransactionList transactions={JSON.parse(JSON.stringify(transactions))} />
                </div>
            </div>
        </div>
    );
}
