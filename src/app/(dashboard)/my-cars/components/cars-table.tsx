"use client"

import { Car, Edit, Trash2, DollarSign, Calendar, Package, Receipt, Eye } from "lucide-react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Car as CarType } from "@/lib/api/cars"

interface CarsTableProps {
  cars: CarType[]
  onEdit: (car: CarType) => void
  onMarkSold: (car: CarType) => void
  onDelete: (carId: string) => void
  onManageExpenses: (car: CarType) => void
}

export function CarsTable({ cars, onEdit, onMarkSold, onDelete, onManageExpenses }: CarsTableProps) {
  if (cars.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="size-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No cars yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Start building your inventory by adding your first car
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Vehicles</CardTitle>
        <CardDescription>
          {cars.length} {cars.length === 1 ? "vehicle" : "vehicles"} in your inventory
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
                <TableHead>Purchase Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="size-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {car.year} {car.make || ""} {car.model}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {car.vin}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="size-3" />
                      {car.purchase_price.toLocaleString('en-US', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="size-3 text-muted-foreground" />
                      {format(new Date(car.purchase_date), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={car.status === "IN_STOCK" ? "default" : "secondary"}
                      className={
                        car.status === "IN_STOCK" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary"
                      }
                    >
                      {car.status === "IN_STOCK" ? "In Stock" : "Sold"}
                    </Badge>
                    {car.status === "SOLD" && car.sale_price && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Sold: ${car.sale_price.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {car.status === "SOLD" ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onManageExpenses(car)}
                            className="hover:bg-blue-500/10 hover:text-blue-600"
                            title="View Expenses"
                          >
                            <Receipt className="size-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(car)}
                            className="hover:bg-primary/10 hover:text-primary"
                            title="View Details"
                          >
                            <Eye className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onManageExpenses(car)}
                            className="hover:bg-blue-500/10 hover:text-blue-600"
                            title="Manage Expenses"
                          >
                            <Receipt className="size-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(car)}
                            className="hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="size-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onMarkSold(car)}
                            className="hover:bg-green-500/10 hover:text-green-600"
                          >
                            <DollarSign className="size-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(car.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
