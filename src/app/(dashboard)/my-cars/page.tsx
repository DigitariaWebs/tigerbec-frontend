"use client"

import { useState, useEffect } from "react"
import { carsApi, type Car } from "@/lib/api/cars"
import { inventoryRequestsApi, type InventoryRequest } from "@/lib/api/inventory-requests"
import { CarsTable } from "./components/cars-table"
import { RequestsTable } from "./components/requests-table"
import { CarExpensesModal } from "./components/car-expenses-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function MyCarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [requests, setRequests] = useState<InventoryRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCarForExpenses, setSelectedCarForExpenses] = useState<Car | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [carsData, requestsData] = await Promise.all([
        carsApi.getCars(),
        inventoryRequestsApi.getMyRequests()
      ])
      setCars(carsData)
      setRequests(requestsData)
      setError(null)
    } catch (err) {
      console.error("Failed to load data:", err)
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button onClick={loadData} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Cars</h1>
          <p className="text-muted-foreground mt-1">
            View your vehicle inventory and requests
          </p>
        </div>
      </div>

      {/* Inventory Requests Table */}
      <RequestsTable requests={requests} />

      {/* Cars Table - Read Only */}
      <CarsTable
        cars={cars}
        onManageExpenses={(car) => setSelectedCarForExpenses(car)}
      />

      {selectedCarForExpenses && (
        <CarExpensesModal
          open={!!selectedCarForExpenses}
          onOpenChange={(open) => {
            if (!open) setSelectedCarForExpenses(null)
          }}
          carId={selectedCarForExpenses.id}
          carName={`${selectedCarForExpenses.year} ${selectedCarForExpenses.make || ""} ${selectedCarForExpenses.model}`.trim()}
          purchasePrice={selectedCarForExpenses.purchase_price}
          carStatus={selectedCarForExpenses.status}
        />
      )}
    </div>
  )
}
