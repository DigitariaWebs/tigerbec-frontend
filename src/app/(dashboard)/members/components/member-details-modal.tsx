"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { membersApi } from "@/lib/api/members"
import { Profile, MemberStats, Car } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Calendar, Clock, Car as CarIcon, Phone } from "lucide-react"

interface UserDetailsModalProps {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsModal({ userId, open, onOpenChange }: UserDetailsModalProps) {
  const { data: user, isLoading: userLoading, error: userError } = useQuery<Profile>({
    queryKey: ['member', userId],
    queryFn: () => membersApi.getById(userId!),
    enabled: !!userId && open,
  })

  const { data: stats, isLoading: statsLoading } = useQuery<MemberStats>({
    queryKey: ['member-stats', userId],
    queryFn: () => membersApi.getStats(userId!),
    enabled: !!userId && open,
  })

  const { data: cars = [], isLoading: carsLoading } = useQuery<Car[]>({
    queryKey: ['member-cars', userId],
    queryFn: () => membersApi.getCars(userId!),
    enabled: !!userId && open,
  })

  const generateAvatar = (name: string) => {
    if (!name || typeof name !== 'string') return '??'
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isLoading = userLoading || statsLoading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
          <DialogDescription>
            View detailed information about this member
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : userError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="font-semibold">Error loading member details</p>
            <p className="text-sm">{userError instanceof Error ? userError.message : 'An error occurred'}</p>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                  {generateAvatar(user.full_name || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-semibold">{user.full_name}</h3>
                  <Badge variant="secondary">
                    Member
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user.email || stats?.email || 'No email'}</p>
              </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="cars">Cars ({cars.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div className="rounded-full p-2 bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">User ID</p>
                      <p className="text-sm font-mono">{user.id || user.user_id || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div className="rounded-full p-2 bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                      <p className="text-sm">{user.email || stats?.email || 'Not provided'}</p>
                    </div>
                  </div>

                  {stats?.phone && (
                    <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="rounded-full p-2 bg-primary/10">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                        <p className="text-sm">{stats.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div className="rounded-full p-2 bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p className="text-sm">{new Date(user.date_of_birth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div className="rounded-full p-2 bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                      <p className="text-sm">{formatDate(user.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                    <div className="rounded-full p-2 bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-sm">{formatDate(user.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cars" className="space-y-4 mt-4">
                {carsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : cars.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No cars found for this member</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {cars.map((car) => (
                      <div key={car.id} className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <div className="rounded-full p-2 bg-primary/10">
                          <CarIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{car.year} {car.model}</p>
                            <Badge variant={car.status === 'sold' ? 'default' : 'secondary'}>
                              {car.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">VIN:</span> {car.vin}
                            </div>
                            <div>
                              <span className="font-medium">Mileage:</span> {car.mileage?.toLocaleString() ?? 'N/A'} mi
                            </div>
                            <div>
                              <span className="font-medium">Purchase:</span> ${parseFloat(car.purchase_price).toLocaleString()}
                            </div>
                            {car.sale_price && (
                              <div>
                                <span className="font-medium">Sale:</span> ${parseFloat(car.sale_price).toLocaleString()}
                              </div>
                            )}
                            {car.profit && (
                              <div className="col-span-2">
                                <span className="font-medium">Profit:</span> 
                                <span className={parseFloat(car.profit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {' '}${parseFloat(car.profit).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
