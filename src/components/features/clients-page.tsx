"use client";

import { useState } from "react";
import { getClients, createClient } from "@/actions/client-actions";
import { Plus, Search, Phone, User, Edit2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import Link from "next/link";
import { Client } from "@/entities/Client";
import { Avatar } from "@/components/ui/avatar";
import { updateClient, deleteClient } from "@/actions/client-actions";

export default function ClientsPage({ initialClients }: { initialClients: Client[] }) {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [search, setSearch] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filtered = clients.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    async function handleAdd(formData: FormData) {
        setIsSubmitting(true);
        const result = await createClient(formData);
        if (result.success) {
            setIsAddModalOpen(false);
            window.location.reload();
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    }

    async function handleEdit(formData: FormData) {
        if (!editingClient) return;
        setIsSubmitting(true);
        const result = await updateClient(editingClient.id, formData);
        if (result.success) {
            setEditingClient(null);
            window.location.reload();
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    }

    async function handleDelete(e: React.MouseEvent, id: string) {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this client? This will also delete all their transactions.")) {
            const result = await deleteClient(id);
            if (result.success) {
                window.location.reload();
            } else {
                alert(result.error);
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-main">Client Ledger</h1>
                    <p className="text-muted font-sm">Manage your property clients and incoming payments</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-action"
                >
                    <Plus className="h-5 w-5" />
                    Add Client
                </button>
            </div>

            {/* Search bar */}
            <div className="relative group px-2">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                <input
                    placeholder="Search by client name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
            </div>

            <div className="grid gap-2 md:grid-cols-2 px-2">
                {filtered.map((client, i) => (
                    <motion.div
                        key={client.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Link href={`/dashboard/clients/${client.id}`} className="block transition-transform hover:scale-[1.01] active:scale-[0.99] group/card">
                            <div className="card-premium flex items-center justify-between group p-3 relative overflow-hidden">
                                <div className="flex items-center gap-4">
                                    <Avatar name={client.name} size="lg" className="shadow-md" />
                                    <div className="space-y-0.5">
                                        <div className="font-black text-lg text-main flex items-center gap-2 group-hover:text-primary transition-colors">
                                            {client.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {client.phone && (
                                                <span className="text-[14px] font-bold text-muted opacity-80 flex items-center gap-1">
                                                    <Phone className="h-2.5 w-2.5" /> {client.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted group-hover/card:bg-primary group-hover/card:text-white transition-all">
                                        <User className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Client">
                <form action={handleAdd} className="space-y-6 pt-2">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Client Name</label>
                        <input
                            name="name"
                            required
                            className="w-full bg-secondary border-2 border-border rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all placeholder:text-muted-foreground/30 text-main"
                            placeholder="e.g. Acme Property"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone</label>
                        <input
                            name="phone"
                            className="w-full bg-secondary border-2 border-border rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all placeholder:text-muted-foreground/30 text-main"
                            placeholder="9876543210"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notes</label>
                        <textarea
                            name="notes"
                            className="w-full bg-secondary border-2 border-border rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all min-h-[120px] placeholder:text-muted-foreground/30 text-main"
                            placeholder="Client details or property info..."
                        />
                    </div>

                    <div className="pt-2 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-16 rounded-[1.5rem] justify-center text-lg font-black bg-gradient-to-br from-primary to-[#0055D4] text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? "Saving..." : "Create Client Account"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={!!editingClient} onClose={() => setEditingClient(null)} title="Edit Client Profile">
                {editingClient && (
                    <form action={handleEdit} className="space-y-6 pt-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Client Name</label>
                            <input
                                name="name"
                                defaultValue={editingClient.name}
                                required
                                className="w-full bg-secondary border-2 border-border rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all placeholder:text-muted-foreground/30 text-main"
                                placeholder="e.g. Acme Property"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone</label>
                            <input
                                name="phone"
                                defaultValue={editingClient.phone}
                                className="w-full bg-secondary border-2 border-border rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all placeholder:text-muted-foreground/30 text-main"
                                placeholder="9876543210"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notes</label>
                            <textarea
                                name="notes"
                                defaultValue={editingClient.notes}
                                className="w-full bg-secondary border-2 border-border rounded-2xl p-4 outline-none focus:border-primary font-bold transition-all min-h-[120px] placeholder:text-muted-foreground/30 text-main"
                                placeholder="Client details or property info..."
                            />
                        </div>

                        <div className="pt-2 flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-16 rounded-[1.5rem] justify-center text-lg font-black bg-gradient-to-br from-primary to-[#0055D4] text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? "Saving..." : "Update Client Profile"}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}
