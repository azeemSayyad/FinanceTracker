"use client";

import { useState } from "react";
import { getClients, createClient } from "@/actions/client-actions";
import { Plus, Search, Phone, User } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import Link from "next/link";
import { Client } from "@/entities/Client";

export default function ClientsPage({ initialClients }: { initialClients: Client[] }) {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filtered = clients.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const result = await createClient(formData);
        if (result.success) {
            setIsModalOpen(false);
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
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">Manage your clients and incoming payments.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    Add Client
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>

            {/* List */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((client, i) => (
                    <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Link href={`/dashboard/clients/${client.id}`}>
                            <div className="bg-card border border-border rounded-xl p-2 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-lg group-hover:scale-110 transition-transform">
                                        {client.name.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{client.name}</h3>
                                    {client.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <Phone className="h-3 w-3" />
                                            {client.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No clients found.
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client">
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Client Name</label>
                        <input name="name" required className="w-full bg-background border border-border rounded-lg p-1.5 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Acme Corp" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone (Optional)</label>
                        <input name="phone" className="w-full bg-background border border-border rounded-lg p-1.5 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. 9876543210" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Notes (Optional)</label>
                        <textarea name="notes" className="w-full bg-background border border-border rounded-lg p-1.5 focus:ring-2 focus:ring-primary/20 outline-none min-h-[80px]" placeholder="Additional details..." />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50">
                            {isSubmitting ? "Saving..." : "Create Client"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
