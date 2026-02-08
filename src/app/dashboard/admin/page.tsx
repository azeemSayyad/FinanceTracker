import { getUsers } from "@/actions/admin-actions";
import { AdminUserList } from "@/components/features/admin-user-list";
import { getSession } from "@/lib/auth";
import { UserRole } from "@/lib/types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const session = await getSession();

    if (!session || session.role !== UserRole.ADMIN) {
        redirect("/dashboard");
    }

    const users = await getUsers();
    const plainUsers = JSON.parse(JSON.stringify(users));

    return (
        <AdminUserList users={plainUsers} />
    );
}
