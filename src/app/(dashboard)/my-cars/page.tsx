"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { carsApi, type Car } from "@/lib/api/cars"
import { inventoryRequestsApi, type InventoryRequest } from "@/lib/api/inventory-requests"
import { CarsTable } from "./components/cars-table"
import { RequestsTable } from "./components/requests-table"
import { AddCarModal } from "./components/add-car-modal"
import { EditCarModal } from "./components/edit-car-modal"
import { MarkAsSoldModal } from "./components/mark-as-sold-modal"
import { CarExpensesModal } from "./components/car-expenses-modal"
import { Skeleton } from "@/components/ui/skeleton"

export default function MyCarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [requests, setRequests] = useState<InventoryRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSoldModalOpen, setIsSoldModalOpen] = useState(false)
  const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

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

  const loadCars = async () => {
    try {
      const data = await carsApi.getCars()
      setCars(data)
    } catch (err) {
      console.error("Failed to load cars:", err)
    }
  }

  const handleEdit = (car: Car) => {
    setSelectedCar(car)
    setIsEditModalOpen(true)
  }

  const handleMarkSold = (car: Car) => {
    setSelectedCar(car)
    setIsSoldModalOpen(true)
  }

  const handleManageExpenses = (car: Car) => {
    setSelectedCar(car)
    setIsExpensesModalOpen(true)
  }

  const handleDelete = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return
    
    try {
      await carsApi.deleteCar(carId)
      await loadCars()
    } catch (err) {
      console.error("Failed to delete car:", err)
      alert("Failed to delete car")
    }
  }

  const handleModalClose = () => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setIsSoldModalOpen(false)
    setIsExpensesModalOpen(false)
    setSelectedCar(null)
    loadData()
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
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
            Manage your vehicle inventory and requests
          </p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Request to Add Car
        </Button>
      </div>

      {/* Inventory Requests Table */}
      <RequestsTable requests={requests} />

      {/* Cars Table */}
      <CarsTable
        cars={cars}
        onEdit={handleEdit}
        onMarkSold={handleMarkSold}
        onDelete={handleDelete}
        onManageExpenses={handleManageExpenses}
      />

      {/* Modals */}
      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
      />
      
      {selectedCar && (
        <>
          <EditCarModal
            isOpen={isEditModalOpen}
            onClose={handleModalClose}
            car={selectedCar}
          />
          
          <MarkAsSoldModal
            isOpen={isSoldModalOpen}
            onClose={handleModalClose}
            car={selectedCar}
          />

          <CarExpensesModal
            open={isExpensesModalOpen}
            onOpenChange={(open) => {
              setIsExpensesModalOpen(open)
              if (!open) {
                setSelectedCar(null)
              }
            }}
            carId={selectedCar.id}
            carName={`${selectedCar.year} ${selectedCar.make || ""} ${selectedCar.model}`}
            purchasePrice={selectedCar.purchase_price}
            carStatus={selectedCar.status}
          />
        </>
      )}
    </div>
  )
}
