"use client"

import { useState, useEffect } from "react"
import { X, Car, ChevronRight, RotateCcw, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { inventoryRequestsApi } from "@/lib/api/inventory-requests"
import vehiclesData from "../../../../../vehicles.json"

interface AddCarModalProps {
  isOpen: boolean
  onClose: () => void
}

interface VehicleData {
  Make: string
  Models: string[]
}

const vehicles = vehiclesData as VehicleData[]

export function AddCarModal({ isOpen, onClose }: AddCarModalProps) {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  
  const [selectedMake, setSelectedMake] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  
  const [makeSearchQuery, setMakeSearchQuery] = useState("")
  const [modelSearchQuery, setModelSearchQuery] = useState("")
  
  const [formData, setFormData] = useState({
    vin: "",
    year: new Date().getFullYear(),
    purchase_price: "",
    purchase_date: new Date().toISOString().split('T')[0],
    notes: "",
  })

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
      setSelectedMake("")
      setSelectedModel("")
      setMakeSearchQuery("")
      setModelSearchQuery("")
      setFormData({
        vin: "",
        year: new Date().getFullYear(),
        purchase_price: "",
        purchase_date: new Date().toISOString().split('T')[0],
        notes: "",
      })
    }
  }, [isOpen])

  const handleMakeSelect = (make: string) => {
    setSelectedMake(make)
  }

  const handleModelSelect = (model: string) => {
    setSelectedModel(model)
  }

  const handleNext = () => {
    if (currentStep === 1 && selectedMake) {
      setModelSearchQuery("") // Reset model search when moving to model selection
      setCurrentStep(2)
    } else if (currentStep === 2 && selectedModel) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      setCurrentStep(1)
      setSelectedModel("")
      setModelSearchQuery("")
    }
  }

  const handleReset = () => {
    setCurrentStep(1)
    setSelectedMake("")
    setSelectedModel("")
    setMakeSearchQuery("")
    setModelSearchQuery("")
    setFormData({
      vin: "",
      year: new Date().getFullYear(),
      purchase_price: "",
      purchase_date: new Date().toISOString().split('T')[0],
      notes: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.vin || !formData.purchase_price) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      await inventoryRequestsApi.create({
        vin: formData.vin,
        make: selectedMake,
        model: selectedModel,
        year: formData.year,
        purchase_price: formData.purchase_price,
        purchase_date: formData.purchase_date || undefined,
        notes: formData.notes || undefined,
      })
      
      alert("Request submitted successfully! Your request is pending admin approval.")
      onClose()
    } catch (error) {
      console.error("Failed to submit request:", error)
      alert("Failed to submit request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Select Vehicle Make"
      case 2: return "Select Vehicle Model"
      case 3: return "Enter Vehicle Details"
    }
  }

  const availableModels = vehicles.find(v => v.Make === selectedMake)?.Models || []
  
  // Remove duplicate models
  const uniqueModels = [...new Set(availableModels)]

  // Filter makes based on search query
  const filteredMakes = vehicles.filter(vehicle =>
    vehicle.Make.toLowerCase().includes(makeSearchQuery.toLowerCase())
  )

  // Filter models based on search query
  const filteredModels = uniqueModels.filter(model =>
    model.toLowerCase().includes(modelSearchQuery.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogTitle className="sr-only">Request Inventory Approval</DialogTitle>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-foreground/20">
              <Car className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Request Inventory Approval</h2>
              <p className="text-primary-foreground/80 text-sm mt-1">
                Submit a request to add a vehicle to your inventory
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 mt-4">
            <div className={`h-1 flex-1 rounded-full transition-all ${currentStep >= 1 ? 'bg-primary-foreground' : 'bg-primary-foreground/20'}`} />
            <div className={`h-1 flex-1 rounded-full transition-all ${currentStep >= 2 ? 'bg-primary-foreground' : 'bg-primary-foreground/20'}`} />
            <div className={`h-1 flex-1 rounded-full transition-all ${currentStep >= 3 ? 'bg-primary-foreground' : 'bg-primary-foreground/20'}`} />
          </div>
        </div>

        {/* Step 1: Select Make */}
        {currentStep === 1 && (
          <div>
            <div className="px-6 py-4 border-b space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{getStepTitle()}</h3>
                <p className="text-sm text-muted-foreground mt-1">Select the manufacturer</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search makes..."
                  value={makeSearchQuery}
                  onChange={(e) => setMakeSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="p-2">
                {filteredMakes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No makes found matching &quot;{makeSearchQuery}&quot;
                  </div>
                ) : (
                  filteredMakes.map((vehicle) => (
                  <button
                    key={vehicle.Make}
                    onClick={() => handleMakeSelect(vehicle.Make)}
                    className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      selectedMake === vehicle.Make 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <span className="font-medium">{vehicle.Make}</span>
                    <ChevronRight className={`size-4 transition-transform ${
                      selectedMake === vehicle.Make ? 'translate-x-1' : 'group-hover:translate-x-1'
                    }`} />
                  </button>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-6 border-t bg-muted/50 flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedMake}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Select Model */}
        {currentStep === 2 && (
          <div>
            <div className="px-6 py-4 border-b space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{getStepTitle()}</h3>
                <p className="text-sm text-muted-foreground mt-1">Choose your vehicle model</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  value={modelSearchQuery}
                  onChange={(e) => setModelSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="p-2">
                {filteredModels.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No models found matching &quot;{modelSearchQuery}&quot;
                  </div>
                ) : (
                  filteredModels.map((model) => (
                  <button
                    key={model}
                    onClick={() => handleModelSelect(model)}
                    className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      selectedModel === model 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <span className="font-medium">{model}</span>
                    <ChevronRight className={`size-4 transition-transform ${
                      selectedModel === model ? 'translate-x-1' : 'group-hover:translate-x-1'
                    }`} />
                  </button>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="p-6 border-t bg-muted/50 flex gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedModel}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Enter Details */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">{getStepTitle()}</h3>
              <p className="text-sm text-muted-foreground mt-1">Fill in the vehicle information</p>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="p-6 space-y-4">
                {/* Selected Vehicle Display */}
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="text-sm text-muted-foreground">Selected Vehicle</div>
                  <div className="font-semibold text-lg mt-1">
                    {selectedMake} {selectedModel}
                  </div>
                </div>

                {/* VIN */}
                <div>
                  <Label htmlFor="vin">VIN Number *</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    placeholder="1HGBH41JXMN109186"
                    required
                    className="font-mono"
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
                      className="pl-7"
                      required
                    />
                  </div>
                </div>

                {/* Purchase Date */}
                <div>
                  <Label htmlFor="purchase_date">Purchase Date</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional information about this vehicle..."
                    rows={3}
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="p-6 border-t bg-muted/50 space-y-3">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="w-full"
                disabled={loading}
              >
                <RotateCcw className="size-4 mr-2" />
                Start Over
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
