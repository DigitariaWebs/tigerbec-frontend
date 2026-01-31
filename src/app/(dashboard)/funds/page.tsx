"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Wallet, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { format } from "date-fns"
import { fundRequestsApi, type FundRequest } from "@/lib/api/fund-requests"
import { RequestFundsModal } from "./components/request-funds-modal"
import { FundRequestDetailsModal } from "./components/fund-request-details-modal"

export default function FundsPage() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<FundRequest | null>(null)
  const queryClient = useQueryClient()

  // Fetch fund requests
  const { data: requests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['fund-requests'],
    queryFn: () => fundRequestsApi.getAll(),
  })

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['fund-requests-stats'],
    queryFn: () => fundRequestsApi.getStats(),
  })

  const statusConfig = {
    pending: { 
      label: "Pending", 
      variant: "outline" as const, 
      className: "border-yellow-500 text-yellow-700",
      icon: Clock 
    },
    approved: { 
      label: "Approved", 
      variant: "outline" as const, 
      className: "border-green-500 text-green-700",
      icon: CheckCircle 
    },
    rejected: { 
      label: "Rejected", 
      variant: "outline" as const, 
      className: "border-red-500 text-red-700",
      icon: XCircle 
    },
  }

  const handleRequestSuccess = () => {
    setIsRequestModalOpen(false)
    queryClient.invalidateQueries({ queryKey: ['fund-requests'] })
    queryClient.invalidateQueries({ queryKey: ['fund-requests-stats'] })
    toast.success("Fund request submitted successfully!")
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Funds</h1>
          <p className="text-muted-foreground">
            Manage your balance and fund requests
          </p>
        </div>
        <Button onClick={() => setIsRequestModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Request Funds
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requested</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.total_amount_requested.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.total_amount_approved.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fund Requests History</CardTitle>
          <CardDescription>
            View and track all your fund requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingRequests ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No fund requests yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by creating your first fund request
              </p>
              <Button onClick={() => setIsRequestModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Request Funds
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Reviewed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => {
                    const StatusIcon = statusConfig[request.status].icon
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          ${request.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={statusConfig[request.status].variant}
                            className={statusConfig[request.status].className}
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[request.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.notes || '-'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(request.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {request.reviewed_at 
                            ? format(new Date(request.reviewed_at), "MMM d, yyyy")
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <RequestFundsModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={handleRequestSuccess}
      />

      {selectedRequest && (
        <FundRequestDetailsModal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
        />
      )}
    </div>
  )
}
