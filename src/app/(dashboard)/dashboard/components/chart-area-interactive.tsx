"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChevronDown, Check } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { carSalesApi } from "@/lib/api/car-sales"

export const description = "An interactive area chart showing investments and profit"

interface ChartDataPoint {
  date: string
  investment: number
  profit: number
}

const chartConfig = {
  financial: {
    label: "Financial",
  },
  investment: {
    label: "Investment",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const timeRangeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 3 months" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "2y", label: "2 Years" },
  { value: "5y", label: "5 Years" },
  { value: "lifetime", label: "Lifetime" },
]

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [open, setOpen] = React.useState(false)
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadChartData = async () => {
      try {
        const memberUser = localStorage.getItem('member_user')
        if (!memberUser) {
          setLoading(false)
          return
        }

        // Fetch car sales data directly
        const carSales = await carSalesApi.getMyCarSales()
        
        // Aggregate sales data by date
        const salesByDate = new Map<string, { investment: number; profit: number }>()
        
        carSales.forEach((sale) => {
          const date = new Date(sale.sold_date).toISOString().split('T')[0]
          const existing = salesByDate.get(date) || { investment: 0, profit: 0 }
          
          salesByDate.set(date, {
            investment: existing.investment + (sale.purchase_price_snapshot || 0),
            profit: existing.profit + (sale.profit || 0),
          })
        })

        // Convert to array and sort by date
        const dataPoints: ChartDataPoint[] = Array.from(salesByDate.entries())
          .map(([date, values]) => ({
            date,
            investment: values.investment,
            profit: values.profit,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        // If no sales data, create empty data points
        if (dataPoints.length === 0) {
          const today = new Date()
          for (let i = 89; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            dataPoints.push({
              date: date.toISOString().split('T')[0],
              investment: 0,
              profit: 0,
            })
          }
        }

        setChartData(dataPoints)
      } catch (error) {
        console.error("Failed to load chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    
    // Return all data for lifetime
    if (timeRange === "lifetime") {
      return true
    }
    
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    } else if (timeRange === "3m") {
      daysToSubtract = 90
    } else if (timeRange === "6m") {
      daysToSubtract = 180
    } else if (timeRange === "90d") {
      daysToSubtract = 90
    } else if (timeRange === "1y") {
      daysToSubtract = 365
    } else if (timeRange === "2y") {
      daysToSubtract = 730
    } else if (timeRange === "5y") {
      daysToSubtract = 1825
    } 
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Investment and profit trends
          </span>
          <span className="@[540px]/card:hidden">Financial trends</span>
        </CardDescription>
        <CardAction>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-[180px] justify-between"
              >
                {timeRangeOptions.find((opt) => opt.value === timeRange)?.label || "Select period"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-1">
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTimeRange(option.value)
                        setOpen(false)
                      }}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                        timeRange === option.value && "bg-accent"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          timeRange === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillInvestment" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-investment)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-investment)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-profit)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-profit)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  formatter={(value) => {
                    return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="investment"
              type="monotone"
              fill="url(#fillInvestment)"
              stroke="var(--color-investment)"
              strokeWidth={2}
            />
            <Area
              dataKey="profit"
              type="monotone"
              fill="url(#fillProfit)"
              stroke="var(--color-profit)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
