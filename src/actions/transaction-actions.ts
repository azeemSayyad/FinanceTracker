"use server";

import { getDataSource } from "@/lib/db";
import { Transaction } from "@/entities/Transaction";
import { TransactionType } from "@/lib/types";
import { s3Client, BUCKET_NAME } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

async function uploadFileToS3(file: File) {
    const fileBuffer = await file.arrayBuffer();
    const fileExtension = file.name.split(".").pop();
    const key = `receipts/${uuidv4()}.${fileExtension}`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: Buffer.from(fileBuffer),
            ContentType: file.type,
            ACL: "public-read", // Ensure bucket allows public read or handle signed URLs
        })
    );

    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function createTransaction(formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string);
    const type = formData.get("type") as TransactionType; // INCOMING or OUTGOING
    const date = formData.get("date") as string;
    const notes = formData.get("notes") as string;
    const workerId = formData.get("workerId") as string;
    const clientId = formData.get("clientId") as string;
    const imageFile = formData.get("image") as File;

    if (!amount || !type || !date) {
        return { error: "Missing required fields" };
    }

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
        try {
            imageUrl = await uploadFileToS3(imageFile);
        } catch (e) {
            console.error("S3 Upload Failed", e);
            // Continue without image or return error? 
            // Let's continue but warn
        }
    }

    try {
        const db = await getDataSource();
        const repo = db.getRepository(Transaction);

        const transaction = new Transaction();
        transaction.amount = amount;
        transaction.type = type;
        transaction.date = new Date(date);
        transaction.notes = notes;
        transaction.imageUrl = imageUrl || undefined; // undefined if null

        if (workerId) transaction.worker = { id: workerId } as any;
        if (clientId) transaction.client = { id: clientId } as any;

        await repo.save(transaction);

        revalidatePath("/dashboard");
        if (workerId) revalidatePath(`/dashboard/workers/${workerId}`);
        if (clientId) revalidatePath(`/dashboard/clients/${clientId}`);

        return { success: true };
    } catch (error) {
        console.error("Create transaction error:", error);
        return { error: "Failed to record transaction" };
    }
}

export async function getTransactionsByWorker(workerId: string) {
    const db = await getDataSource();
    const repo = db.getRepository(Transaction);
    return await repo.find({ where: { worker: { id: workerId } }, order: { date: "DESC" } });
}

export async function getTransactionsByClient(clientId: string) {
    const db = await getDataSource();
    const repo = db.getRepository(Transaction);
    return await repo.find({ where: { client: { id: clientId } }, order: { date: "DESC" } });
}

export async function updateTransaction(id: string, formData: FormData) {
    const amount = parseFloat(formData.get("amount") as string);
    const date = formData.get("date") as string;
    const notes = formData.get("notes") as string;
    const imageFile = formData.get("image") as File;

    if (!amount || !date) {
        return { error: "Amount and Date are required" };
    }

    try {
        const db = await getDataSource();
        const repo = db.getRepository(Transaction);

        const transaction = await repo.findOne({
            where: { id },
            relations: ["worker", "client"]
        });
        if (!transaction) return { error: "Transaction not found" };

        transaction.amount = amount;
        transaction.date = new Date(date);
        transaction.notes = notes;

        if (imageFile && imageFile.size > 0) {
            transaction.imageUrl = await uploadFileToS3(imageFile);
        }

        await repo.save(transaction);

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/transactions");
        if (transaction.workerId) revalidatePath(`/dashboard/workers/${transaction.workerId}`);
        if (transaction.clientId) revalidatePath(`/dashboard/clients/${transaction.clientId}`);

        return { success: true };
    } catch (error) {
        console.error("Update transaction error:", error);
        return { error: "Failed to update transaction" };
    }
}

export async function deleteTransaction(id: string) {
    try {
        const db = await getDataSource();
        const repo = db.getRepository(Transaction);

        const transaction = await repo.findOneBy({ id });
        if (!transaction) return { error: "Transaction not found" };

        await repo.delete(id);

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/transactions");
        if (transaction.workerId) revalidatePath(`/dashboard/workers/${transaction.workerId}`);
        if (transaction.clientId) revalidatePath(`/dashboard/clients/${transaction.clientId}`);

        return { success: true };
    } catch (error) {
        console.error("Delete transaction error:", error);
        return { error: "Failed to delete transaction" };
    }
}
