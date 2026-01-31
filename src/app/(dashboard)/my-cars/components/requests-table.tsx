"use client"

import * as React from "react"
import { format } from "date-fns"
import { Car, Calendar, DollarSign, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import type { InventoryRequest } from "@/lib/api/inventory-requests"

interface RequestsTableProps {
  requests: InventoryRequest[]
}

const statusConfig = {
  pending: { 
    label: "Pending Review", 
    icon: Clock,
    variant: "outline" as const, 
    className: "border-yellow-500 text-yellow-700",
    bgColor: "bg-yellow-500/10"
  },
  approved: { 
    label: "Approved", 
    icon: CheckCircle,
    variant: "outline" as const, 
    className: "border-green-500 text-green-700",
    bgColor: "bg-green-500/10"
  },
  rejected: { 
    label: "Rejected", 
    icon: XCircle,
    variant: "outline" as const, 
    className: "border-red-500 text-red-700",
    bgColor: "bg-red-500/10"
  },
}

export function RequestsTable({ requests }: RequestsTableProps) {
  if (requests.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Requests</CardTitle>
        <CardDescription>
          Track your car addition requests and their approval status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const statusInfo = statusConfig[request.status]
                const StatusIcon = statusInfo.icon
                
                return (
                  <React.Fragment key={request.id}>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {request.year} {request.make || ""} {request.model}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {request.vin}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-3 w-3" />
                          {request.purchase_price.toLocaleString('en-US', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant} className={statusInfo.className}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(new Date(request.created_at), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                    </TableRow>
                    {request.status === 'rejected' && request.rejection_reason && (
                      <TableRow key={`${request.id}-rejection`}>
                        <TableCell colSpan={5} className="bg-red-500/5">
                          <Alert className="border-red-500/20">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-sm">
                              <span className="font-semibold text-red-700">Rejection Reason:</span>{" "}
                              {request.rejection_reason}
                            </AlertDescription>
                          </Alert>
                        </TableCell>
                      </TableRow>
                    )}
                    {request.notes && (
                      <TableRow key={`${request.id}-notes`}>
                        <TableCell colSpan={5} className="bg-muted/30">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Your Note:</span> {request.notes}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
