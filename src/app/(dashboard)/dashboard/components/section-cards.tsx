"use client"

import { useEffect, useState } from "react"
import { TrendingDown, TrendingUp, DollarSign, Car, Package, ShoppingCart, Wallet } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { membersApi } from "@/lib/api/members"
import Link from "next/link"

interface DashboardStats {
  balance?: number
  cars: { total: number; inInventory: number; sold: number }
  financial: {
    totalInvestment: number
    totalRevenue: number
    totalGrossProfit: number
    totalNetProfit: number
    profitMargin: number
    netProfitMargin: number
  }
}

export function SectionCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const memberUser = localStorage.getItem('member_user')
        if (!memberUser) {
          setLoading(false)
          return
        }

        const dashboardData = await membersApi.getMyDashboard()
        setStats({
          balance: dashboardData.balance ?? 0,
          cars: {
            total: dashboardData.cars?.total ?? 0,
            inInventory: dashboardData.cars?.inInventory ?? 0,
            sold: dashboardData.cars?.sold ?? 0,
          },
          financial: {
            totalInvestment: dashboardData.financial?.totalInvestment ?? 0,
            totalRevenue: dashboardData.financial?.totalRevenue ?? 0,
            totalGrossProfit: dashboardData.financial?.totalGrossProfit ?? 0,
            totalNetProfit: dashboardData.financial?.totalNetProfit ?? 0,
            profitMargin: dashboardData.financial?.profitMargin ?? 0,
            netProfitMargin: dashboardData.financial?.netProfitMargin ?? 0,
          },
        })
      } catch (error) {
        console.error("Failed to load dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Account Balance</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              $0.00
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              Request funds to get started
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Investments</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              $0.00
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              Start by adding your first car
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Profit</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              $0.00
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              No sales recorded yet
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Cars Owned</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              0
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              No cars in inventory
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Cars Sold</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              0
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              No cars sold yet
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const grossProfitTrend = (stats.financial.totalGrossProfit ?? 0) > 0
  const netProfitTrend = (stats.financial.totalNetProfit ?? 0) > 0

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Account Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-primary">
            ${(stats.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Wallet className="size-3" />
               
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Link href="/funds">
            <Button variant="link" size="sm" className="h-auto p-0 font-medium">
              Request Funds →
            </Button>
          </Link>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Investments</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${Number(stats.financial.totalInvestment ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <DollarSign className="size-3" />
              {stats.cars.total} {stats.cars.total === 1 ? 'car' : 'cars'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total capital invested
          </div>
          <div className="text-muted-foreground">
            {stats.cars.inInventory} in inventory
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Gross Profit</CardDescription>
          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${grossProfitTrend ? 'text-green-600' : 'text-red-600'}`}>
            ${Number(stats.financial.totalGrossProfit ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {grossProfitTrend ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {(stats.financial.profitMargin ?? 0).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Before franchise fees
          </div>
          <div className="text-muted-foreground">
            {(stats.financial.profitMargin ?? 0).toFixed(1)}% profit margin
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Net Profit</CardDescription>
          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${netProfitTrend ? 'text-green-600' : 'text-red-600'}`}>
            ${Number(stats.financial.totalNetProfit ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {netProfitTrend ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {(stats.financial.netProfitMargin ?? 0).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            After franchise fees
          </div>
          <div className="text-muted-foreground">
            {(stats.financial.netProfitMargin ?? 0).toFixed(1)}% net margin
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Cars Owned</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.cars.inInventory}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Package className="size-3" />
              In Stock
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Current inventory
          </div>
          <div className="text-muted-foreground">
            {stats.cars.total} total cars managed
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Cars Sold</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.cars.sold}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ShoppingCart className="size-3" />
              Sales
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total vehicles sold
          </div>
          <div className="text-muted-foreground">
            Revenue: ${Number(stats.financial.totalRevenue ?? 0).toLocaleString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
