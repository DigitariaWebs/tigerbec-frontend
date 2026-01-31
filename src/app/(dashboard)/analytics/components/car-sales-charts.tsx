"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { carSalesApi } from "@/lib/api/car-sales"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { TrendingUp, DollarSign } from "lucide-react"

const chartConfig = {
  sales: {
    label: "Sales Count",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-3))",
  },
}

export function CarSalesCharts() {
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
          <CardTitle>Car Sales Overview</CardTitle>
          <CardDescription>Monthly sales performance and revenue</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (!sales || sales.length === 0) {
    return (
      <Card className="cursor-pointer">
        <CardHeader>
          <CardTitle>Car Sales Overview</CardTitle>
          <CardDescription>Monthly sales performance and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No sales data available</p>
        </CardContent>
      </Card>
    )
  }

  // Group sales by month
  const monthlySales = sales.reduce((acc, sale) => {
    const date = new Date(sale.sold_date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        sales: 0,
        revenue: 0,
        profit: 0,
      }
    }

    acc[monthKey].sales += 1
    acc[monthKey].revenue += sale.sold_price
    acc[monthKey].profit += sale.profit

    return acc
  }, {} as Record<string, { month: string; sales: number; revenue: number; profit: number }>)

  // Convert to array and sort by month
  const chartData = Object.entries(monthlySales)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months
    .map(([, data]) => data)

  // Calculate totals
  const totalSales = sales.length
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.sold_price, 0)
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0)

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Car Sales Overview</CardTitle>
            <CardDescription>Last 6 months performance</CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold">{totalSales}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Sales</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-blue-600">
              ${(totalRevenue / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-muted-foreground mt-1">Revenue</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-green-600">
              ${(totalProfit / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-muted-foreground mt-1">Profit</p>
          </div>
        </div>

        {/* Bar Chart */}
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              className="text-xs"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-xs"
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === 'sales') return [`${value} sales`, 'Sales']
                    if (name === 'revenue') return [`$${Number(value).toLocaleString()}`, 'Revenue']
                    if (name === 'profit') return [`$${Number(value).toLocaleString()}`, 'Profit']
                    return [value, name]
                  }}
                />
              }
            />
            <Bar
              dataKey="sales"
              fill="var(--color-sales)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
