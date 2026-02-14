"use server";

import { getDataSource } from "@/lib/db";
import { Client } from "@/entities/Client";
import { revalidatePath } from "next/cache";

export async function getClients() {
    const db = await getDataSource();
    const repo = db.getRepository(Client);
    return await repo.find({ order: { createdAt: "DESC" } });
}

export async function createClient(formData: FormData) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;

    if (!name) {
        return { error: "Name is required" };
    }

    try {
        const db = await getDataSource();
        const repo = db.getRepository(Client);

        const client = new Client();
        client.name = name;
        client.phone = phone;
        client.notes = notes;

        await repo.save(client);
        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error) {
        console.error("Create client error:", error);
        return { error: "Failed to create client" };
    }
}

export async function getClientById(id: string) {
    const db = await getDataSource();
    const repo = db.getRepository(Client);
    return await repo.findOne({ where: { id }, relations: ["transactions"] });
}

export async function updateClient(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;

    if (!name) {
        return { error: "Name is required" };
    }

    try {
        const db = await getDataSource();
        const repo = db.getRepository(Client);

        const client = await repo.findOneBy({ id });
        if (!client) return { error: "Client not found" };

        client.name = name;
        client.phone = phone;
        client.notes = notes;

        await repo.save(client);
        revalidatePath("/dashboard/clients");
        revalidatePath(`/dashboard/clients/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Update client error:", error);
        return { error: "Failed to update client" };
    }
}

export async function deleteClient(id: string) {
    try {
        const db = await getDataSource();
        const repo = db.getRepository(Client);
        await repo.delete(id);
        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error) {
        console.error("Delete client error:", error);
        return { error: "Failed to delete client" };
    }
}
