"use server";

import { getDataSource } from "@/lib/db";
import { User } from "@/entities/User";
import { UserRole } from "@/lib/types";
import { login } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
        return { error: "Username and password are required" };
    }

    try {
        const db = await getDataSource();
        const repo = db.getRepository(User);

        // Auto-seed admin if no users exist
        const count = await repo.count();
        if (count === 0) {
            const adminUser = new User();
            adminUser.username = process.env.ADMIN_USERNAME || "admin";
            adminUser.passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin", 10);
            adminUser.role = UserRole.ADMIN;
            await repo.save(adminUser);
            console.log("Admin user seeded automatically.");
        }

        const user = await repo.findOneBy({ username });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return { error: "Invalid credentials" };
        }

        await login({ userId: user.id, username: user.username, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        return { error: "An error occurred during login" };
    }

    // Redirect must be outside try-catch
    redirect("/dashboard");
}
