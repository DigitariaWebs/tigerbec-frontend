"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { carSalesApi } from "@/lib/api/car-sales"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { TrendingUp } from "lucide-react"

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
}

export function ProfitTrendChart() {
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
          <CardTitle>Profit Trend</CardTitle>
          <CardDescription>Revenue and profit over time</CardDescription>
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
          <CardTitle>Profit Trend</CardTitle>
          <CardDescription>Revenue and profit over time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No sales data available</p>
        </CardContent>
      </Card>
    )
  }

  // Group sales by month for trend
  const monthlyData = sales.reduce((acc, sale) => {
    const date = new Date(sale.sold_date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        profit: 0,
        revenue: 0,
      }
    }

    acc[monthKey].profit += sale.profit
    acc[monthKey].revenue += sale.sold_price

    return acc
  }, {} as Record<string, { month: string; profit: number; revenue: number }>)

  // Convert to array and sort
  const chartData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, data]) => data)

  // Calculate growth
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0)
  const avgProfit = totalProfit / chartData.length
  const profitMargin = (totalProfit / sales.reduce((sum, sale) => sum + sale.sold_price, 0)) * 100

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profit Trend</CardTitle>
            <CardDescription>Last 6 months revenue and profit</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              {profitMargin.toFixed(1)}% margin
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-green-600">
              ${(avgProfit / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-muted-foreground mt-1">Avg. Monthly Profit</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted">
            <p className="text-2xl font-bold">{profitMargin.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Profit Margin</p>
          </div>
        </div>

        {/* Area Chart */}
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-profit)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-profit)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
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
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                    name === 'profit' ? 'Profit' : 'Revenue'
                  ]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke="var(--color-revenue)"
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stackId="2"
              stroke="var(--color-profit)"
              fill="url(#colorProfit)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
