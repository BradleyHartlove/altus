// import { useQuery } from "@tanstack/react-query"
import {
    Table,
    TableBody,
    TableCaption,
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
                {(data ?? []).map((p) => (
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
