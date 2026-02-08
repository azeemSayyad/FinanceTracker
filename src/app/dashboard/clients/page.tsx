import { getClients } from "@/actions/client-actions";
import ClientsPageClient from "@/components/features/clients-page";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
    const clients = await getClients();
    const plainClients = JSON.parse(JSON.stringify(clients));
    return <ClientsPageClient initialClients={plainClients} />;
}
