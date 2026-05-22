import { useQuery } from "@tanstack/react-query"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const API_BASE = "http://localhost:8080"

interface Parishioner {
    id: string
    name: string
    city: string
    status: string
    email: string
    is_registered: boolean
    members: number
}

async function fetchParishioners(): Promise<Parishioner[]> {
    const res = await fetch(`${API_BASE}/parishioners`, {
        signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data.parishioners
}

export function ParishionerTable() {
    const { data: parishioners, isLoading, error } = useQuery({
        queryKey: ["parishioners"],
        queryFn: fetchParishioners,
    })

    if (isLoading) return <div className="flex justify-center items-center h-full"><p className="text-xl text-muted-foreground">Loading...</p></div>
    if (error) return <div className="flex justify-center items-center h-full"><p className="text-xl text-destructive">Error: {error.message}</p></div>

    return (
        <Table>
            <TableCaption>All registered parishioners.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {(parishioners ?? []).map((p) => (
                    <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.city}</TableCell>
                        <TableCell>{p.status}</TableCell>
                        <TableCell>{p.email}</TableCell>
                        <TableCell>{p.is_registered ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-right">{p.members}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
