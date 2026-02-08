"use client";

import { useState } from "react";
import { AddTransactionModal } from "./add-transaction-modal";
import { TransactionType } from "@/lib/types";
import { Plus } from "lucide-react";

export function AddTransactionButton({ workerId, clientId, defaultType, label }: { workerId?: string, clientId?: string, defaultType: TransactionType, label: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-foreground text-background px-5 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95"
            >
                <Plus className="h-5 w-5" />
                {label}
            </button>

            <AddTransactionModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                workerId={workerId}
                clientId={clientId}
                defaultType={defaultType}
            />
        </>
    );
}
