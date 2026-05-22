import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { API_BASE } from '@/lib/constants';
import { ParishionerStatus } from '@/schemas/types'
import { Separator } from '@/components/ui/separator';


export function AddModal() {
    const [open, setOpen] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)
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

        const response = await fetch(`${API_BASE}/parishioners`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        if (response.ok) {
            form.reset()
            setIsRegistered(false)
            setOpen(false)
            await queryClient.invalidateQueries({ queryKey: ["parishioners"] })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Family</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Family</DialogTitle>
                        <DialogDescription>
                            Enter information for new parishioner family here.
                        </DialogDescription>
                    </DialogHeader>
                    <Separator className="my-2" />
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <Input name="name" placeholder="John Doe" required />
                        </Field>
                        <Field>
                            <FieldLabel>City</FieldLabel>
                            <Input name="city" placeholder="Chester" required />
                        </Field>
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input name="email" placeholder="sally.jane@example.com" required />
                        </Field>
                        <Field>
                            <FieldLabel>Members</FieldLabel>
                            <Input name="members" placeholder="5" required />
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
                        <Button type="submit">Add Family</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
