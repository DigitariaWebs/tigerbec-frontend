"use client"

import { useEffect, useState } from "react"
import { Car, Package } from "lucide-react"
import { format } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { membersApi } from "@/lib/api/members"

interface CarData {
  id: string
  make: string
  model: string
  year: number
  purchase_price: number
  status: string
  purchase_date: string
}

export function CarsCard() {
  const [cars, setCars] = useState<CarData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCars = async () => {
      try {
        const memberUser = localStorage.getItem('member_user')
        if (!memberUser) {
          setLoading(false)
          return
        }

        const carsData = await membersApi.getMyCars()
        setCars(carsData as unknown as CarData[])
      } catch (error) {
        console.error("Failed to load cars:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCars()
  }, [])

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="size-5" />
          My Cars
        </CardTitle>
        <CardDescription>
          {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} in your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="size-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No cars in inventory</p>
            <p className="text-xs text-muted-foreground mt-1">
              Add your first car to get started
            </p>
          </div>
        ) : (
          <ScrollArea className="h-100 pr-4">
            <div className="space-y-3">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="flex flex-col gap-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {car.year} {car.make} {car.model}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Purchased: {format(new Date(car.purchase_date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge 
                      variant={car.status === "IN_STOCK" ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {car.status === "IN_STOCK" ? "In Stock" : "Sold"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Investment</span>
                    <span className="font-medium">
                      ${car.purchase_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
