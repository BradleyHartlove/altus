import type { Parishioner } from "@/schemas/types";
import { columns } from "./Columns"
import { DataTable } from "./DataTable"

interface ParishionerTableProps {
    data: Parishioner[]
}

export function ParishionerTable({ data }: ParishionerTableProps) {

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
