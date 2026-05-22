import type { Parishioner } from '@/schemas/types';
import { ParishionerTable } from './ParishionerTable'
import { useQuery } from '@tanstack/react-query';
import { AddModal } from './AddModal';
import { API_BASE } from '@/lib/constants';

const Home = () => {
    async function fetchParishioners(): Promise<Parishioner[]> {
        const res = await fetch(`${API_BASE}/parishioners`, {
            signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        return data.parishioners
    }

    const { data: parishioners, isLoading, error } = useQuery({
        queryKey: ["parishioners"],
        queryFn: fetchParishioners,
    })

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <p className="text-base text-muted-foreground tracking-wide">Loading...</p>
        </div>
    )
    if (error) return (
        <div className="flex justify-center items-center h-64">
            <p className="text-base text-destructive">Error: {error.message}</p>
        </div>
    )

    return (
        <div className='bg-card border border-border rounded-2xl shadow-sm overflow-hidden'>
            <div className="flex flex-row items-center px-6 py-5 border-b border-border">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">Family Explorer</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage and view parishioner families</p>
                </div>
                <div className="ml-auto">
                    <AddModal />
                </div>
            </div>
            <div className="px-2">
                <ParishionerTable data={parishioners ?? []} />
            </div>
        </div>
    )
}

export default Home