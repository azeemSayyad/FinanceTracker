export enum UserRole {
    ADMIN = "admin",
    PARTNER = "partner",
}

export enum TransactionType {
    INCOMING = "incoming",
    OUTGOING = "outgoing",
}

export interface TransactionDTO {
    id: string;
    amount: number;
    type: TransactionType;
    date: Date | string;
    notes?: string;
    imageUrl?: string;
    worker?: { name: string };
    client?: { name: string };
}
