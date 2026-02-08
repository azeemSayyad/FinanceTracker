import { getWorkers } from "@/actions/worker-actions";
import WorkersPageClient from "@/components/features/workers-page";

export const dynamic = "force-dynamic";

export default async function WorkersPage() {
    const workers = await getWorkers();
    const plainWorkers = JSON.parse(JSON.stringify(workers));

    return <WorkersPageClient initialWorkers={plainWorkers} />;
}
