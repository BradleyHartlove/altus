// import { useQuery } from "@tanstack/react-query"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { Parishioner } from "@/schemas/types";

interface ParishionerTableProps {
    data: Parishioner[]
}

export function ParishionerTable({ data }: ParishionerTableProps) {

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="table-header py-3">Name</TableHead>
                    <TableHead className="table-header">City</TableHead>
                    <TableHead className="table-header">Status</TableHead>
                    <TableHead className="table-header">Email</TableHead>
                    <TableHead className="table-header">Registered</TableHead>
                    <TableHead className="table-header text-right">Members</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {(data ?? []).map((p) => (
                    <TableRow key={p.id} className="border-border/60">
                        <TableCell className="font-medium text-foreground py-3">{p.name}</TableCell>
                        <TableCell className="text-muted-foreground">{p.city}</TableCell>
                        <TableCell className="text-muted-foreground">{p.status}</TableCell>
                        <TableCell className="text-muted-foreground">{p.email}</TableCell>
                        <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${p.is_registered
                                ? 'bg-green-100 text-green-700'
                                : 'bg-muted text-muted-foreground'
                                }`}>
                                {p.is_registered ? "Registered" : "Not registered"}
                            </span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">{p.members}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
