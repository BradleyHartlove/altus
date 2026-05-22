import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { API_BASE } from '@/lib/constants';
import { ParishionerStatus, type Parishioner } from "@/schemas/types";
import { Separator } from '@/components/ui/separator';
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useState, useEffect } from "react";

interface DeleteModalProps {
    parishioner: Parishioner
    show: boolean
    setCallback: (open: boolean) => void
}

export function EditModal({ parishioner, show, setCallback }: DeleteModalProps) {
    const [isRegistered, setIsRegistered] = useState(parishioner.is_registered)

    useEffect(() => {
        if (show) {
            setIsRegistered(parishioner.is_registered)
        }
    }, [show, parishioner.is_registered])
    const queryClient = useQueryClient()

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const data = new FormData(form)

        const payload = {
            name: data.get("name") as string,
            city: data.get("city") as string,
            email: data.get("email") as string,
            members: parseInt(data.get("members") as string, 10),
            status: ParishionerStatus.Active,
            is_registered: isRegistered,
        }

        const response = await fetch(`${API_BASE}/parishioners/${parishioner.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        if (response.ok) {
            form.reset()
            // setIsRegistered(false)
            // setOpen(false)
            setCallback(false)
            await queryClient.invalidateQueries({ queryKey: ["parishioners"] })
        }
    }

    return (
        <Dialog open={show} onOpenChange={setCallback}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Family</DialogTitle>
                        <DialogDescription>
                            Update information for parishioner family here.
                        </DialogDescription>
                    </DialogHeader>
                    <Separator className="my-2" />
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <Input name="name" placeholder="John Doe" defaultValue={parishioner.name} required />
                        </Field>
                        <Field>
                            <FieldLabel>City</FieldLabel>
                            <Input name="city" placeholder="Chester" defaultValue={parishioner.city} required />
                        </Field>
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input name="email" placeholder="sally.jane@example.com" defaultValue={parishioner.email} required />
                        </Field>
                        <Field>
                            <FieldLabel>Members</FieldLabel>
                            <Input name="members" placeholder="5" defaultValue={parishioner.members} required />
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox
                                checked={isRegistered}
                                onCheckedChange={(v) => setIsRegistered(!!v)}
                            />
                            <FieldLabel>Registered</FieldLabel>
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Update Family</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
