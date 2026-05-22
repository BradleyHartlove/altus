"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Parishioner } from "@/schemas/types"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DeleteModal } from "./DeleteModal"
import { useState } from "react"

function ActionsCell({ parishioner }: { parishioner: Parishioner }) {
    const [showModal, setShowModal] = useState(false)

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowModal(!showModal)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteModal parishioner={parishioner} show={showModal} setCallback={(open: boolean) => { setShowModal(open) }} />
        </div>
    )
}

export const columns: ColumnDef<Parishioner>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "city",
        header: "City",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "is_registered",
        header: "Registered",
        cell: ({ row }) => (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.original.is_registered
                ? 'bg-green-100 text-green-700'
                : 'bg-muted text-muted-foreground'
                }`}>
                {row.original.is_registered ? "Registered" : "Not registered"}
            </span>
        ),
    },
    {
        accessorKey: "members",
        header: "Members",
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell parishioner={row.original} />,
    },
]