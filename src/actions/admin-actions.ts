"use server";

import { getDataSource } from "@/lib/db";
import { User } from "@/entities/User";
import { UserRole } from "@/lib/types";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

// Ensure only admin can call these
async function checkAdmin() {
    const session = await getSession();
    if (!session || session.role !== UserRole.ADMIN) {
        throw new Error("Unauthorized");
    }
}

export async function getUsers() {
    await checkAdmin();
    const db = await getDataSource();
    const repo = db.getRepository(User);
    return await repo.find({ order: { createdAt: "DESC" } });
}

export async function createUser(formData: FormData) {
    try {
        await checkAdmin();
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        if (!username || !password) return { error: "Missing fields" };

        const db = await getDataSource();
        const repo = db.getRepository(User);

        const exists = await repo.findOneBy({ username });
        if (exists) return { error: "Username already exists" };

        const user = new User();
        user.username = username;
        user.passwordHash = await bcrypt.hash(password, 10);
        user.role = UserRole.PARTNER; // Defaults to partner

        await repo.save(user);
        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create user" };
    }
}

export async function deleteUser(id: string) {
    try {
        await checkAdmin();
        const db = await getDataSource();
        const repo = db.getRepository(User);
        await repo.delete(id);
        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete user" };
    }
}
