"use client";

import { useState } from "react";
import { getWorkers, createWorker } from "@/actions/worker-actions";
import { Plus, Search, Phone, Briefcase, Edit2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import Link from "next/link";
import { Worker } from "@/entities/Worker";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { updateWorker, deleteWorker } from "@/actions/worker-actions";

export default function WorkersPage({ initialWorkers }: { initialWorkers: Worker[] }) {
    const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Extract unique categories
    const categories = ["All", ...Array.from(new Set(workers.map(w => w.category))).filter(Boolean)];

    const filtered = workers.filter((w) => {
        const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
            w.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "All" || w.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    async function handleAdd(formData: FormData) {
        setIsSubmitting(true);
        const result = await createWorker(formData);
        if (result.success) {
            setIsAddModalOpen(false);
            window.location.reload();
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    }

    async function handleEdit(formData: FormData) {
        if (!editingWorker) return;
        setIsSubmitting(true);
        const result = await updateWorker(editingWorker.id, formData);
        if (result.success) {
            setEditingWorker(null);
            window.location.reload();
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    }

    async function handleDelete(e: React.MouseEvent, id: string) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this worker? This will also delete all their transactions.")) {
            const result = await deleteWorker(id);
            if (result.success) {
                window.location.reload();
            } else {
                alert(result.error);
            }
        }
    }

    const getCategoryStyles = (category: string) => {
        const cats: Record<string, string> = {
            'TILES': 'border-blue-500/50 text-blue-600 bg-blue-500/5',
            'PAINT': 'border-orange-500/50 text-orange-600 bg-orange-500/5',
            'PLUMBING': 'border-green-500/50 text-green-600 bg-green-500/5',
            'ELECTRICAL': 'border-amber-500/50 text-amber-600 bg-amber-500/5',
            'INTERIOR DESIGNER': 'border-rose-500/50 text-rose-600 bg-rose-500/5',
            'DEFAULT': 'border-slate-500/30 text-slate-500 bg-slate-500/5'
        };
        return cats[category.toUpperCase()] || cats['DEFAULT'];
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-main">Workers Ledger</h1>
                    <p className="text-muted text-xs">Manage your field workers and pay status</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-action"
                >
                    <Plus className="h-5 w-5" />
                    Add Worker
                </button>
            </div>

            {/* Category Filter & Search */}
            <div className="space-y-3 px-2">
                {/* Horizontal Category Scroll */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                selectedCategory === cat
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground border border-transparent hover:border-border/50"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search bar */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary transition-colors transition-all" />
                    <input
                        placeholder="Search workers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2 px-2">
                {filtered.map((worker, i) => (
                    <motion.div
                        key={worker.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Link href={`/dashboard/workers/${worker.id}`} className="block transition-transform active:scale-[0.99] group/card">
                            <div className="card-premium flex items-center justify-between group p-3 relative overflow-hidden">
                                <div className="flex items-center gap-4">
                                    <Avatar name={worker.name} size="lg" className="shadow-sm border-2 border-background" />
                                    <div className="space-y-1.5">
                                        <div className="font-black text-lg text-main leading-tight group-hover:text-primary transition-colors">
                                            {worker.name}
                                        </div>
                                        {worker.phone && (
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted opacity-80">
                                                <Phone className="h-3 w-3" />
                                                {worker.phone}
                                            </div>
                                        )}

                                        <div className="">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border transition-all",
                                                getCategoryStyles(worker.category)
                                            )}>
                                                {worker.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted group-hover/card:text-primary transition-colors" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Worker">
                <form action={handleAdd} className="space-y-6 pt-2">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">Full Name</label>
                        <input
                            name="name"
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
                                className="w-full bg-secondary border-2 border-border/50 rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all placeholder:text-muted-foreground/30 text-foreground"
                                placeholder="9876543210"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">Category</label>
                            <input
                                name="category"
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
                            className="w-full bg-secondary border-2 border-border/50 rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all min-h-[120px] placeholder:text-muted-foreground/30 text-foreground"
                            placeholder="Worker details..."
                        />
                    </div>

                    <div className="pt-2 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-16 rounded-[1.5rem] justify-center text-lg font-black bg-gradient-to-br from-primary to-[#0055D4] text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? "Saving..." : "Create Worker Profile"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={!!editingWorker} onClose={() => setEditingWorker(null)} title="Edit Worker Profile">
                {editingWorker && (
                    <form action={handleEdit} className="space-y-6 pt-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">Full Name</label>
                            <input
                                name="name"
                                defaultValue={editingWorker.name}
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
                                    defaultValue={editingWorker.phone}
                                    className="w-full bg-secondary border-2 border-border/50 rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all placeholder:text-muted-foreground/30 text-foreground"
                                    placeholder="9876543210"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/70 ml-1">Category</label>
                                <input
                                    name="category"
                                    defaultValue={editingWorker.category}
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
                                defaultValue={editingWorker.notes}
                                className="w-full bg-secondary border-2 border-border/50 rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all min-h-[120px] placeholder:text-muted-foreground/30 text-foreground"
                                placeholder="Worker details..."
                            />
                        </div>

                        <div className="pt-2 flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-16 rounded-[1.5rem] justify-center text-lg font-black bg-gradient-to-br from-primary to-[#0055D4] text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? "Saving..." : "Update Worker Profile"}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}
