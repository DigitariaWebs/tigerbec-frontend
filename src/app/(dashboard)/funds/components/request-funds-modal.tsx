"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { fundRequestsApi } from "@/lib/api/fund-requests"

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num >= 0.01;
  }, {
    message: "Amount must be at least $0.01",
  }),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface RequestFundsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function RequestFundsModal({ isOpen, onClose, onSuccess }: RequestFundsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      notes: "",
    },
  })

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await fundRequestsApi.create({
        amount: parseFloat(data.amount),
        notes: data.notes,
      })
      onSuccess()
      form.reset()
    } catch (error: unknown) {
      console.error('Failed to create fund request:', error)
      const message = error instanceof Error ? error.message : "Failed to submit fund request"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Request Funds
          </DialogTitle>
          <DialogDescription>
            Submit a request to add funds to your account balance
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        className="pl-9"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only numbers and decimal point
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the amount you want to add to your balance
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes or context..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide any additional information about this fund request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
