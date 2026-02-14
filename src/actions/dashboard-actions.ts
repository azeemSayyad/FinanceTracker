"use server";

import { getDataSource } from "@/lib/db";
import { Transaction } from "@/entities/Transaction";
import { TransactionType } from "@/lib/types";

export async function getDashboardStats() {
    const db = await getDataSource();
    const repo = db.getRepository(Transaction);

    const allTransactions = await repo.find();

    const totalIncoming = allTransactions
        .filter(t => t.type === TransactionType.INCOMING)
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalOutgoing = allTransactions
        .filter(t => t.type === TransactionType.OUTGOING)
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
        totalIncoming,
        totalOutgoing,
        netBalance: totalIncoming - totalOutgoing
    };
}

export async function getRecentTransactions(limit = 10, type?: TransactionType) {
    const db = await getDataSource();
    const repo = db.getRepository(Transaction);

    const where: any = {};
    if (type) where.type = type;

    return await repo.find({
        where,
        order: { date: "DESC" },
        take: limit,
        relations: ["worker", "client"]
    });
}
