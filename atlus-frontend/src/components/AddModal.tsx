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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddModal() {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button>Add Family</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Add Family</DialogTitle>
                        <DialogDescription>
                            Enter information for new parishioner family here.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label>Name</Label>
                            <Input name="name" placeholder="John Doe" required />
                        </Field>
                        <Field>
                            <Label>City</Label>
                            <Input name="city" placeholder="Chester" required />
                        </Field>
                        <Field>
                            <Label>Email</Label>
                            <Input name="email" placeholder="sally.jane@example.com" required />
                        </Field>
                        <Field>
                            <Label>Members</Label>
                            <Input name="members" placeholder="5" required />
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox />
                            <Label>
                                Registered
                            </Label>
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Add Family</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
