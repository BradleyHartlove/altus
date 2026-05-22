import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { API_BASE } from '@/lib/constants';
import type { Parishioner } from "@/schemas/types";
import { Separator } from '@/components/ui/separator';

interface DeleteModalProps {
    parishioner: Parishioner
    show: boolean
    setCallback: (open: boolean) => void
}

export function DeleteModal({ parishioner, show, setCallback }: DeleteModalProps) {
    // const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        const response = await fetch(`${API_BASE}/parishioners/${parishioner.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })

        if (response.ok) {
            await queryClient.invalidateQueries({ queryKey: ["parishioners"] })
        }
    }

    return (
        <Dialog open={show} onOpenChange={setCallback}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Delete Family</DialogTitle>
                    </DialogHeader>
                    <Separator className="my-2" />
                    <span>Are you sure you want to delete this parishioner?</span>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Delete</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
