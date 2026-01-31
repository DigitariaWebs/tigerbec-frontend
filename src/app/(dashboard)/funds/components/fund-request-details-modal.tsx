"use client"

import { format } from "date-fns"
import { CheckCircle, XCircle, DollarSign, Calendar, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type FundRequest } from "@/lib/api/fund-requests"

interface FundRequestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  request: FundRequest
}

const statusConfig = {
  pending: { label: "Pending Review", variant: "outline" as const, className: "border-yellow-500 text-yellow-700" },
  approved: { label: "Approved", variant: "outline" as const, className: "border-green-500 text-green-700" },
  rejected: { label: "Rejected", variant: "outline" as const, className: "border-red-500 text-red-700" },
}

export function FundRequestDetailsModal({ isOpen, onClose, request }: FundRequestDetailsModalProps) {
  const statusInfo = statusConfig[request.status]
  const isPending = request.status === 'pending'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fund Request Details
          </DialogTitle>
          <DialogDescription>
            Review the details of your fund request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Badge variant={statusInfo.variant} className={statusInfo.className}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* Amount */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <h3 className="font-semibold text-lg">Request Amount</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Amount Requested
              </div>
              <span className="font-bold text-2xl">
                ${request.amount.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
          </div>

          {/* Request Date */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h3 className="font-semibold">Request Information</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Requested on
              </div>
              <span className="font-medium">
                {format(new Date(request.created_at), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>

          {/* Notes */}
          {request.notes && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4" />
                Notes
              </div>
              <p className="text-sm">{request.notes}</p>
            </div>
          )}

          {/* Review Information (if reviewed) */}
          {!isPending && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <h3 className="font-semibold">Review Information</h3>
              
              {request.status === 'approved' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Your request has been approved</span>
                </div>
              )}
              
              {request.status === 'rejected' && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Your request has been rejected</span>
                </div>
              )}

              {request.reviewer_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Reviewed by</p>
                  <p className="font-medium">{request.reviewer_name}</p>
                </div>
              )}
              
              {request.reviewed_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Reviewed on</p>
                  <p className="text-sm">
                    {format(new Date(request.reviewed_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              )}
              
              {request.rejection_reason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700">{request.rejection_reason}</p>
                </div>
              )}
            </div>
          )}

          {/* Pending Notice */}
          {isPending && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Your request is pending review. You will be notified once it has been processed by an administrator.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
