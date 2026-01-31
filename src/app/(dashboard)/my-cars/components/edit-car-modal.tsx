"use client"

import { useState, useEffect } from "react"
import { Edit, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { carsApi, type Car } from "@/lib/api/cars"

interface EditCarModalProps {
  isOpen: boolean
  onClose: () => void
  car: Car
}

export function EditCarModal({ isOpen, onClose, car }: EditCarModalProps) {
  const [loading, setLoading] = useState(false)
  const isSold = car.status === "SOLD"
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: 2024,
    purchase_price: "",
    purchase_date: "",
  })

  useEffect(() => {
    if (car) {
      setFormData({
        make: car.make || "",
        model: car.model,
        year: car.year,
        purchase_price: car.purchase_price.toString(),
        purchase_date: car.purchase_date.split('T')[0],
      })
    }
  }, [car])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.model || !formData.purchase_price) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      await carsApi.updateCar(car.id, {
        make: formData.make || undefined,
        model: formData.model,
        year: formData.year,
        purchase_price: formData.purchase_price,
        purchase_date: formData.purchase_date || undefined,
      })
      
      onClose()
    } catch (error) {
      console.error("Failed to update car:", error)
      alert("Failed to update car. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {isSold ? <Eye className="size-5" /> : <Edit className="size-5" />}
            </div>
            {isSold ? "View Car Details" : "Edit Car Details"}
          </DialogTitle>
          <DialogDescription>
            {isSold ? "Car details (sold vehicles cannot be edited)" : "Update the information for this vehicle"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* VIN (read-only) */}
            <div className="col-span-2">
              <Label htmlFor="vin">VIN Number</Label>
              <Input
                id="vin"
                value={car.vin}
                disabled
                className="font-mono bg-muted"
              />
            </div>

            {/* Make */}
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                placeholder="Toyota"
                disabled={isSold}
                className={isSold ? "bg-muted" : ""}
              />
            </div>

            {/* Model */}
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Camry"
                required
                disabled={isSold}
                className={isSold ? "bg-muted" : ""}
              />
            </div>

            {/* Year */}
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                min="1900"
                max="2100"
                required
                disabled={isSold}
                className={isSold ? "bg-muted" : ""}
              />
            </div>

            {/* Purchase Price */}
            <div>
              <Label htmlFor="purchase_price">Purchase Price *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                  placeholder="25000.00"
                  className={isSold ? "pl-7 bg-muted" : "pl-7"}
                  required
                  disabled={isSold}
                />
              </div>
            </div>

            {/* Purchase Date */}
            <div className="col-span-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                disabled={isSold}
                className={isSold ? "bg-muted" : ""}
              />
            </div>
          </div>

          <DialogFooter>
            {isSold ? (
              <Button
                type="button"
                onClick={onClose}
              >
                Close
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? "Updating..." : "Update Car"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
