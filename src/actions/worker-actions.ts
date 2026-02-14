"use server";

import { getDataSource } from "@/lib/db";
import { Worker } from "@/entities/Worker";
import { revalidatePath } from "next/cache";

export async function getWorkers() {
    const db = await getDataSource();
    const repo = db.getRepository(Worker);
    return await repo.find({ order: { createdAt: "DESC" } });
}

export async function createWorker(formData: FormData) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const category = formData.get("category") as string;
    const notes = formData.get("notes") as string;

    if (!name || !category) {
        return { error: "Name and Category are required" };
    }

    try {
        const db = await getDataSource();
        const repo = db.getRepository(Worker);

        const worker = new Worker();
        worker.name = name;
        worker.phone = phone;
        worker.category = category;
        worker.notes = notes;

        await repo.save(worker);
        revalidatePath("/dashboard/workers");
        return { success: true };
    } catch (error) {
        console.error("Create worker error:", error);
        return { error: "Failed to create worker" };
    }
}

export async function getWorkerById(id: string) {
    const db = await getDataSource();
    const repo = db.getRepository(Worker);
    return await repo.findOne({ where: { id }, relations: ["transactions"] });
}

export async function updateWorker(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const category = formData.get("category") as string;
    const notes = formData.get("notes") as string;

    if (!name || !category) {
        return { error: "Name and Category are required" };
    }

    try {
        const db = await getDataSource();
        const repo = db.getRepository(Worker);

        const worker = await repo.findOneBy({ id });
        if (!worker) return { error: "Worker not found" };

        worker.name = name;
        worker.phone = phone;
        worker.category = category;
        worker.notes = notes;

        await repo.save(worker);
        revalidatePath("/dashboard/workers");
        revalidatePath(`/dashboard/workers/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Update worker error:", error);
        return { error: "Failed to update worker" };
    }
}

export async function deleteWorker(id: string) {
    try {
        const db = await getDataSource();
        const repo = db.getRepository(Worker);
        await repo.delete(id);
        revalidatePath("/dashboard/workers");
        return { success: true };
    } catch (error) {
        console.error("Delete worker error:", error);
        return { error: "Failed to delete worker" };
    }
}
