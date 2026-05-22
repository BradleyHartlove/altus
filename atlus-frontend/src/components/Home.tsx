import type { Parishioner } from '@/schemas/types';
import { ParishionerTable } from './ParishionerTable'
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button"


const Home = () => {
    const API_BASE = "http://localhost:8080"

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

    if (isLoading) return <div className="flex justify-center items-center h-full"><p className="text-xl text-muted-foreground">Loading...</p></div>
    if (error) return <div className="flex justify-center items-center h-full"><p className="text-xl text-destructive">Error: {error.message}</p></div>

    return (
        <div className='border rounded-2xl p-5'>
            <div className="flex flex-row items-center">
                <h1>Family Explorer</h1>
                <div className="ml-auto pb-2">
                    <Button variant={'outline'} size="lg">
                        Add Family
                    </Button>
                </div>
            </div>
            <ParishionerTable data={parishioners ?? []} />
        </div>
    )
}

export default Home