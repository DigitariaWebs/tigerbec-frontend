"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { carSalesApi } from "@/lib/api/car-sales"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Car, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function BestSellingCars() {
  const { data: sales, isLoading } = useQuery({
    queryKey: ['car-sales'],
    queryFn: () => carSalesApi.list(),
    retry: false,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <Card className="cursor-pointer">
        <CardHeader>
          <CardTitle>Best Selling Cars</CardTitle>
          <CardDescription>Top performing vehicle models</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-87.5">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (!sales || sales.length === 0) {
    return (
      <Card className="cursor-pointer">
        <CardHeader>
          <CardTitle>Best Selling Cars</CardTitle>
          <CardDescription>Top performing vehicle models</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No sales data available</p>
        </CardContent>
      </Card>
    )
  }

  // Group by model and calculate stats
  const modelStats = sales.reduce((acc, sale) => {
    const model = `${sale.make_snapshot} ${sale.model_snapshot}`
    
    if (!acc[model]) {
      acc[model] = {
        model,
        make: sale.make_snapshot,
        count: 0,
        totalProfit: 0,
        totalRevenue: 0,
        years: [] as number[],
      }
    }

    acc[model].count += 1
    acc[model].totalProfit += sale.profit
    acc[model].totalRevenue += sale.sold_price
    acc[model].years.push(sale.year_snapshot)

    return acc
  }, {} as Record<string, { model: string; make: string; count: number; totalProfit: number; totalRevenue: number; years: number[] }>)

  // Calculate averages and sort
  const topCars = Object.values(modelStats)
    .map((car) => ({
      ...car,
      avgProfit: car.totalProfit / car.count,
      avgYear: Math.round(car.years.reduce((a: number, b: number) => a + b, 0) / car.years.length),
      profitMargin: (car.totalProfit / car.totalRevenue) * 100,
    }))
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .slice(0, 5)

  const maxCount = Math.max(...topCars.map((car) => car.count))

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Best Selling Cars</CardTitle>
            <CardDescription>Top 5 models by profit performance</CardDescription>
          </div>
          <Car className="h-5 w-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCars.map((car, index: number) => {
            const profitPercentage = (car.count / maxCount) * 100

            return (
              <div
                key={car.model}
                className="space-y-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        #{index + 1}
                      </Badge>
                      <h4 className="font-semibold">{car.model}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg. Year: {car.avgYear}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${(car.totalProfit / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-muted-foreground">Total Profit</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{car.count} sold</span>
                    <span>{profitPercentage.toFixed(0)}% of top</span>
                  </div>
                  <Progress value={profitPercentage} className="h-2" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                      <DollarSign className="h-3 w-3" />
                      <span>Avg Profit</span>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(car.avgProfit / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="text-center border-x">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Margin</span>
                    </div>
                    <p className="text-sm font-semibold text-green-600">
                      {car.profitMargin.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>Revenue</span>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(car.totalRevenue / 1000).toFixed(1)}K
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">
                {topCars.reduce((sum, car) => sum + car.count, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Units Sold</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                ${(topCars.reduce((sum, car) => sum + car.totalProfit, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground mt-1">Combined Profit</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
