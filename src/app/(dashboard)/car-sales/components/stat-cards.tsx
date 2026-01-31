"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, TrendingUp, ShoppingCart, Percent } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils'
import type { CarSaleStats } from "../page"

interface StatCardsProps {
  stats: CarSaleStats
  isLoading?: boolean
}

export function StatCards({ stats, isLoading }: StatCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className='border'>
            <CardContent className='space-y-4'>
              <div className='h-20 animate-pulse bg-muted rounded' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metrics = [
    {
      title: 'Total Sales',
      value: stats.total_sales.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.total_revenue),
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Gross Profit',
      value: formatCurrency(stats.total_gross_profit),
      subtitle: 'Before fees',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Net Profit',
      value: formatCurrency(stats.total_net_profit),
      subtitle: 'After fees',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Avg Profit Ratio',
      value: formatPercentage(stats.average_profit_ratio),
      icon: Percent,
      color: 'text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric, index) => (
        <Card key={index} className='border hover:border-primary/50 transition-colors'>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <metric.icon className={cn('size-6', metric.color)} />
            </div>

            <div className='space-y-2'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>{metric.title}</p>
                {'subtitle' in metric && metric.subtitle && (
                  <p className='text-xs text-muted-foreground/70'>{metric.subtitle}</p>
                )}
              </div>
              <div className='text-2xl font-bold'>{metric.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
