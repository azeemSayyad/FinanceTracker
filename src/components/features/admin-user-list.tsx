"use client";

import { useState } from "react";
import { createUser, deleteUser } from "@/actions/admin-actions";
import { User } from "@/entities/User";
import { UserRole } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Plus, Trash2, Shield, User as UserIcon, MoreVertical, Search, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AdminUserList({ users }: { users: User[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function handleCreate(formData: FormData) {
        setIsSubmitting(true);
        const result = await createUser(formData);
        if (result.success) {
            setIsModalOpen(false);
            window.location.reload();
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return;
        await deleteUser(id);
        window.location.reload();
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Partner Administration</h1>
                    <p className="text-muted-foreground font-medium">Manage property partners and administration access</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary"
                >
                    <Plus className="h-5 w-5" />
                    Add Partner
                </button>
            </div>

            {/* Search bar inside the page */}
            <div className="relative group px-2">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    placeholder="Search partners by name, role, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2 px-4">
                {filteredUsers.map((user, i) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="card-premium flex items-center justify-between group p-3"
                    >

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar name={user.username} size="lg" className="shadow-md" />
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-success rounded-full border-4 border-background flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <div className="font-black text-lg text-foreground flex items-center gap-2">
                                    {user.username}
                                    {user.role === UserRole.ADMIN && (
                                        <div className="bg-primary/10 text-primary border border-primary/20 p-1 rounded-md">
                                            <Shield className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                        user.role === UserRole.ADMIN ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    )}>
                                        {user.role}
                                    </span>
                                    <span className="text-[10px] font-bold text-muted-foreground opacity-60">
                                        Joined {format(new Date(user.createdAt), "MMM yyyy")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {user.role !== UserRole.ADMIN && (
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete User"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            )}
                            <button className="p-3 text-muted-foreground hover:bg-muted rounded-2xl transition-all">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="lg:col-span-2 p-2 text-center bg-card/20 rounded-[2.5rem] border-2 border-dashed border-border">
                        <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground font-black uppercase tracking-widest">No partners found</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Partner Account">
                <form action={handleCreate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-foreground ml-2">Username</label>
                        <input name="username" required className="w-full bg-muted/50 border border-border rounded-2xl p-2 outline-none focus:ring-2 focus:ring-primary/20 font-medium" placeholder="Choose a username" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-foreground ml-2">Password</label>
                        <input name="password" type="password" required className="w-full bg-muted/50 border border-border rounded-2xl p-2 outline-none focus:ring-2 focus:ring-primary/20 font-medium" placeholder="••••••••" />
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white h-14 rounded-2xl font-black shadow-lg shadow-primary/30 transition-all disabled:opacity-50">
                            {isSubmitting ? "Creating Account..." : "Confirm & Create Partner"}
                        </button>
                        <button type="button" onClick={() => setIsModalOpen(false)} className="w-full h-14 rounded-2xl hover:bg-muted text-sm font-bold transition-all">Cancel</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
