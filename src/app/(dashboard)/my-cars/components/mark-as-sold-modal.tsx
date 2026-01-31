"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, Percent } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
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
import { Badge } from "@/components/ui/badge"
import { carsApi, type Car } from "@/lib/api/cars"
import { carExpensesApi } from "@/lib/api/car-expenses"
import { settingsApi } from "@/lib/api/settings"

interface MarkAsSoldModalProps {
  isOpen: boolean
  onClose: () => void
  car: Car
}

export function MarkAsSoldModal({ isOpen, onClose, car }: MarkAsSoldModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sale_price: "",
    sale_date: new Date().toISOString().split('T')[0],
  })

  // Fetch total expenses
  const { data: totalExpensesData } = useQuery({
    queryKey: ["car-expenses-total", car.id],
    queryFn: () => carExpensesApi.getTotalExpenses(car.id),
    enabled: isOpen,
  })

  // Fetch franchise fee
  const { data: franchiseFee = 0 } = useQuery({
    queryKey: ["franchise-fee"],
    queryFn: () => settingsApi.getFranchiseFee(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const totalExpenses = totalExpensesData?.total_expenses || 0
  const totalCost = car.purchase_price + totalExpenses

  const calculateProfit = () => {
    const salePrice = parseFloat(formData.sale_price) || 0
    const grossProfit = salePrice - totalCost
    
    // Only apply franchise fee if there's a positive profit
    const franchiseFeeAmount = grossProfit > 0 ? (grossProfit * franchiseFee) / 100 : 0
    const netProfit = grossProfit - franchiseFeeAmount
    const profitMargin = totalCost > 0 ? (netProfit / totalCost) * 100 : 0
    
    return { grossProfit, franchiseFeeAmount, netProfit, profitMargin }
  }

  const { grossProfit, franchiseFeeAmount, netProfit, profitMargin } = calculateProfit()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.sale_price || !formData.sale_date) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      await carsApi.markAsSold(car.id, {
        sale_price: formData.sale_price,
        sale_date: formData.sale_date,
      })
      
      onClose()
    } catch (error) {
      console.error("Failed to mark car as sold:", error)
      alert("Failed to mark car as sold. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
              <DollarSign className="size-5" />
            </div>
            Mark as Sold
          </DialogTitle>
          <DialogDescription>
            Record the sale details for this vehicle
          </DialogDescription>
        </DialogHeader>

        {/* Car Info */}
        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
          <div className="font-medium text-lg">
            {car.year} {car.make} {car.model}
          </div>
          <div className="text-sm text-muted-foreground">VIN: {car.vin}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Purchase Price:</span>
              <span className="font-medium">
                ${car.purchase_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Additional Expenses:</span>
              <span className="font-medium text-orange-600">
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <span className="font-semibold">Total Cost:</span>
              <span className="font-bold text-primary">
                ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sale Price */}
          <div>
            <Label htmlFor="sale_price">Sale Price *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="sale_price"
                type="number"
                step="0.01"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                placeholder="30000.00"
                className="pl-7"
                required
              />
            </div>
          </div>

          {/* Sale Date */}
          <div>
            <Label htmlFor="sale_date">Sale Date *</Label>
            <Input
              id="sale_date"
              type="date"
              value={formData.sale_date}
              onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
              required
            />
          </div>

          {/* Profit Calculation */}
          {formData.sale_price && (
            <div className="rounded-lg border p-4 space-y-3 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gross Profit</span>
                <span className={`text-base font-semibold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {grossProfit >= 0 ? '+' : '-'}${Math.abs(grossProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-2">
                  <Percent className="size-3 text-orange-600" />
                  <span className="text-sm text-muted-foreground">Platform Fee ({franchiseFee}%)</span>
                </div>
                <span className="text-sm font-medium text-orange-600">
                  -${franchiseFeeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp 
                    className={`size-4 ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                  />
                  <span className="text-sm font-semibold">Net Profit</span>
                </div>
                <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  ${Math.abs(netProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">Profit Margin</span>
                <Badge 
                  variant={netProfit >= 0 ? "default" : "destructive"}
                  className={netProfit >= 0 ? "bg-emerald-600" : ""}
                >
                  {profitMargin > 0 ? '+' : ''}{profitMargin.toFixed(2)}%
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter>
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
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Processing..." : "Mark as Sold"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
