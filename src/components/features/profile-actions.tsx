"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface ProfileActionsProps {
    id: string;
    name: string;
    onEdit: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
    onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
    editModalTitle: string;
    deleteMessage: string;
    children: React.ReactNode; // The form for editing
}

export function ProfileActions({
    id,
    name,
    onEdit,
    onDelete,
    editModalTitle,
    deleteMessage,
    children
}: ProfileActionsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleEditAction(formData: FormData) {
        setIsSubmitting(true);
        const result = await onEdit(formData);
        if (result.success) {
            setIsEditModalOpen(false);
            window.location.reload();
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    }

    async function handleDeleteConfirm() {
        setIsSubmitting(true);
        const result = await onDelete(id);
        if (result.success) {
            window.location.href = window.location.pathname.includes('workers') ? '/dashboard/workers' : '/dashboard/clients';
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setIsEditModalOpen(true)}
                className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm group"
                title="Edit Profile"
            >
                <Edit2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
            <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-white transition-all shadow-sm group"
                title="Delete Profile"
            >
                <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={editModalTitle}>
                <form action={handleEditAction} className="pt-2">
                    {children}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 rounded-2xl justify-center text-lg font-black bg-gradient-to-br from-primary to-[#0055D4] text-white shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? <Spinner className="text-white" size="sm" /> : "Save Changes"}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Confirm Deletion"
                message={deleteMessage}
                confirmText="Delete"
                isLoading={isSubmitting}
            />
        </div>
    );
}
