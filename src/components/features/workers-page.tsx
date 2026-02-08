"use client";

import { useState } from "react";
import { getWorkers, createWorker } from "@/actions/worker-actions";
import { Plus, Search, Phone, Briefcase } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import Link from "next/link";
import { Worker } from "@/entities/Worker";

export default function WorkersPage({ initialWorkers }: { initialWorkers: Worker[] }) {
    const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filtered = workers.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.category.toLowerCase().includes(search.toLowerCase())
    );

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const result = await createWorker(formData);
        if (result.success) {
            setIsModalOpen(false);
            // In a real app we might rely on router.refresh() but local state update is instant
            // However, since we passed initialWorkers from server component, we need to refresh logic or use proper hook
            // For now, simpler to just trigger a full page refresh or let the server action revalidatePath handle it, 
            // but client state won't update automatically without router.refresh().
            // Let's do a window reload or better, use router.refresh() if we had it imported.
            // Actually, since revalidatePath is used, a router.refresh() would fetch new data.
            window.location.reload();
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workers</h1>
                    <p className="text-muted-foreground">Manage your team and ongoing payments.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Add Worker
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search workers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                />
            </div>

            {/* List */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((worker, i) => (
                    <motion.div
                        key={worker.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Link href={`/dashboard/workers/${worker.id}`}>
                            <div className="glass-card rounded-xl p-2 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform">
                                            {worker.name.charAt(0)}
                                        </div>
                                        <div className="px-2 py-1 rounded-md bg-secondary/50 text-xs font-medium text-secondary-foreground border border-secondary">
                                            {worker.category}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{worker.name}</h3>
                                        {worker.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Phone className="h-3 w-3" />
                                                {worker.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground glass-card rounded-xl">
                        No workers found.
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Worker">
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input name="name" required className="w-full bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg p-1.5 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. John Doe" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone (Optional)</label>
                            <input name="phone" className="w-full bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg p-1.5 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. 9876543210" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <input name="category" required className="w-full bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg p-1.5 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Plumber" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Notes (Optional)</label>
                        <textarea name="notes" className="w-full bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg p-1.5 focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]" placeholder="Additional details..." />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50">
                            {isSubmitting ? "Saving..." : "Create Worker"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
