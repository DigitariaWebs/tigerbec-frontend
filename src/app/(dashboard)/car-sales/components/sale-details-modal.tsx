"use client"

import { DollarSign, FileText, TrendingDown, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { CarSale } from "@/lib/api/car-sales"

interface SaleDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  sale: CarSale
}

export function SaleDetailsModal({ isOpen, onClose, sale }: SaleDetailsModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const calculateProfitRatio = (profit: number, purchasePrice: number) => {
    if (purchasePrice === 0) return 0
    return ((profit / purchasePrice) * 100)
  }

  const grossProfitRatio = calculateProfitRatio(sale.profit, sale.purchase_price_snapshot)
  const netProfitRatio = calculateProfitRatio(sale.net_profit, sale.purchase_price_snapshot)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sale Financial Details
          </DialogTitle>
          <DialogDescription>
            {sale.year_snapshot} {sale.make_snapshot} {sale.model_snapshot}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Information */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Vehicle</h3>
            <div className="space-y-1">
              <p className="font-medium">{sale.year_snapshot} {sale.make_snapshot} {sale.model_snapshot}</p>
              <p className="text-sm text-muted-foreground font-mono">{sale.vin_snapshot}</p>
            </div>
          </div>

          {/* Purchase & Sale Prices */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <h3 className="font-semibold">Transaction Details</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Purchase Price</span>
                <span className="font-medium">{formatCurrency(sale.purchase_price_snapshot)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sale Price</span>
                <span className="font-medium text-primary">{formatCurrency(sale.sold_price)}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Additional Expenses</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(sale.additional_expenses_snapshot)}
                </span>
              </div>
            </div>
          </div>

          {/* Profit Analysis */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <h3 className="font-semibold">Profit Analysis</h3>
            
            <div className="space-y-3">
              {/* Gross Profit */}
              <div className="p-3 rounded-lg bg-background">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Gross Profit</span>
                    <Badge variant="outline" className="text-xs">
                      Before Fees
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {sale.profit >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`font-bold ${sale.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(sale.profit)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">ROI</span>
                  <Badge 
                    variant="outline" 
                    className={`${
                      grossProfitRatio >= 0 
                        ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400'
                        : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400'
                    }`}
                  >
                    {grossProfitRatio >= 0 ? '+' : ''}{grossProfitRatio.toFixed(2)}%
                  </Badge>
                </div>
              </div>

              {/* Franchise Fee */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Franchise Fee</span>
                  <Badge variant="secondary" className="text-xs">
                    {sale.franchise_fee_percentage}%
                  </Badge>
                </div>
                <span className="font-medium text-red-600">
                  -{formatCurrency(sale.franchise_fee_amount)}
                </span>
              </div>

              {/* Net Profit */}
              <div className="p-3 rounded-lg bg-primary/5 border-2 border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-semibold">Net Profit</span>
                    <Badge variant="outline" className="text-xs">
                      After Fees
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {sale.net_profit >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`font-bold text-lg ${sale.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(sale.net_profit)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Net ROI</span>
                  <Badge 
                    variant="outline" 
                    className={`${
                      netProfitRatio >= 0 
                        ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400'
                        : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400'
                    }`}
                  >
                    {netProfitRatio >= 0 ? '+' : ''}{netProfitRatio.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h3 className="font-semibold text-sm">Calculation Breakdown</h3>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sale Price:</span>
                <span>{formatCurrency(sale.sold_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">- Purchase Price:</span>
                <span>({formatCurrency(sale.purchase_price_snapshot)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">- Additional Expenses:</span>
                <span>({formatCurrency(sale.additional_expenses_snapshot)})</span>
              </div>
              <div className="flex justify-between border-t pt-1 font-semibold">
                <span>= Gross Profit:</span>
                <span className={sale.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(sale.profit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">- Franchise Fee ({sale.franchise_fee_percentage}%):</span>
                <span>({formatCurrency(sale.franchise_fee_amount)})</span>
              </div>
              <div className="flex justify-between border-t pt-1 font-bold text-sm">
                <span>= Net Profit:</span>
                <span className={sale.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(sale.net_profit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
