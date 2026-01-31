"use client"

import { useState, useMemo } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDown,
  Search,
  Filter,
  X,
  Calendar,
  Eye,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CarSale } from "@/lib/api/car-sales"
import type { CarSaleFilters } from "../page"
import { Card } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SaleDetailsModal } from "./sale-details-modal"

interface DataTableProps {
  data: CarSale[]
  members: Array<{ user_id: string; name: string }>
  onFiltersChange: (filters: CarSaleFilters) => void
  isLoading?: boolean
  isMemberView?: boolean
}

export function DataTable({ 
  data, 
  members,
  onFiltersChange, 
  isLoading,
  isMemberView = false
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'sold_date', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  
  // Modal state
  const [selectedSale, setSelectedSale] = useState<CarSale | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  
  // Search states
  const [globalSearch, setGlobalSearch] = useState<string>("")
  const [makeSearch, setMakeSearch] = useState<string>("")
  const [modelSearch, setModelSearch] = useState<string>("")
  const [memberSearch, setMemberSearch] = useState<string>("")
  
  // Filter states
  const [selectedMember, setSelectedMember] = useState<string>("")
  const [selectedMake, setSelectedMake] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [minProfit, setMinProfit] = useState<string>("")
  const [maxProfit, setMaxProfit] = useState<string>("")

  // Extract unique years and models from data
  const uniqueYears = useMemo(() => {
    const years = new Set(data.map(sale => sale.year_snapshot))
    return Array.from(years).filter(Boolean).sort((a, b) => b - a)
  }, [data])

  const uniqueMakes = useMemo(() => {
    const makes = new Set(data.map(sale => sale.make_snapshot).filter(Boolean))
    return Array.from(makes).sort()
  }, [data])

  const uniqueModels = useMemo(() => {
    const models = new Set(data.map(sale => sale.model_snapshot))
    return Array.from(models).filter(Boolean).sort()
  }, [data])

  // Filter makes based on search
  const filteredMakes = useMemo(() => {
    if (!makeSearch) return uniqueMakes
    return uniqueMakes.filter(m => 
      m.toLowerCase().includes(makeSearch.toLowerCase())
    )
  }, [uniqueMakes, makeSearch])

  // Filter models based on search
  const filteredModels = useMemo(() => {
    if (!modelSearch) return uniqueModels
    return uniqueModels.filter(m => 
      m.toLowerCase().includes(modelSearch.toLowerCase())
    )
  }, [uniqueModels, modelSearch])

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!memberSearch) return members
    return members.filter(m => 
      m.name.toLowerCase().includes(memberSearch.toLowerCase())
    )
  }, [members, memberSearch])

  // Apply global search to table data (VIN, Make, Model)
  const searchedData = useMemo(() => {
    if (!globalSearch) return data
    const searchLower = globalSearch.toLowerCase()
    return data.filter(sale => 
      sale.vin_snapshot.toLowerCase().includes(searchLower) ||
      (sale.make_snapshot && sale.make_snapshot.toLowerCase().includes(searchLower)) ||
      sale.model_snapshot.toLowerCase().includes(searchLower)
    )
  }, [data, globalSearch])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateProfitRatio = (profit: number, purchasePrice: number) => {
    if (purchasePrice === 0) return 0
    return ((profit / purchasePrice) * 100)
  }

  const applyFilters = () => {
    const filters: CarSaleFilters = {}
    
    if (selectedMember) filters.member_id = selectedMember
    if (selectedMake) filters.make = selectedMake
    if (selectedYear) filters.year = parseInt(selectedYear)
    if (selectedModel) filters.model = selectedModel
    if (startDate) filters.start_date = startDate
    if (endDate) filters.end_date = endDate
    if (minProfit) filters.min_profit = parseFloat(minProfit)
    if (maxProfit) filters.max_profit = parseFloat(maxProfit)
    
    onFiltersChange(filters)
  }

  const clearFilters = () => {
    setSelectedMember("")
    setSelectedMake("")
    setSelectedYear("")
    setSelectedModel("")
    setStartDate("")
    setEndDate("")
    setMinProfit("")
    setMaxProfit("")
    onFiltersChange({})
  }

  const hasActiveFilters = selectedMember || selectedMake || selectedYear || selectedModel || 
                          startDate || endDate || minProfit || maxProfit

  const handleViewDetails = (sale: CarSale) => {
    setSelectedSale(sale)
    setIsDetailsModalOpen(true)
  }

  const columns: ColumnDef<CarSale>[] = [
    {
      accessorKey: "vin_snapshot",
      header: "VIN",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.getValue("vin_snapshot")}</span>
      ),
    },
    {
      accessorKey: "make_snapshot",
      header: "Make",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("make_snapshot") || "N/A"}</span>
      ),
    },
    {
      accessorKey: "model_snapshot",
      header: "Model",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("model_snapshot")}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.year_snapshot}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "purchase_price_snapshot",
      header: "Purchase Price",
      cell: ({ row }) => (
        <span className="text-sm">
          {formatCurrency(row.getValue("purchase_price_snapshot"))}
        </span>
      ),
    },
    {
      accessorKey: "sold_price",
      header: "Sold Price",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {formatCurrency(row.getValue("sold_price"))}
        </span>
      ),
    },
    {
      accessorKey: "profit",
      header: "Gross Profit",
      cell: ({ row }) => {
        const profit = row.getValue("profit") as number
        const profitRatio = calculateProfitRatio(
          profit,
          row.original.purchase_price_snapshot
        )
        
        return (
          <div className="flex flex-col">
            <span className={`font-semibold ${profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(profit)}
            </span>
            <Badge 
              variant="outline" 
              className={`text-xs w-fit ${
                profitRatio >= 0 
                  ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400'
                  : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400'
              }`}
            >
              {profitRatio >= 0 ? '+' : ''}{profitRatio.toFixed(1)}%
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "net_profit",
      header: "Net Profit",
      cell: ({ row }) => {
        const netProfit = row.getValue("net_profit") as number
        const netProfitRatio = calculateProfitRatio(
          netProfit,
          row.original.purchase_price_snapshot
        )
        
        return (
          <div className="flex flex-col">
            <span className={`font-semibold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(netProfit)}
            </span>
            <Badge 
              variant="outline" 
              className={`text-xs w-fit ${
                netProfitRatio >= 0 
                  ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400'
                  : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400'
              }`}
            >
              {netProfitRatio >= 0 ? '+' : ''}{netProfitRatio.toFixed(1)}%
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "additional_expenses_snapshot",
      header: "Add. Expenses",
      cell: ({ row }) => {
        const expenses = row.getValue("additional_expenses_snapshot") as number
        
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-red-600">
              {formatCurrency(expenses)}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs cursor-pointer"
              onClick={() => handleViewDetails(row.original)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Details
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "sold_date",
      header: "Sold Date",
      cell: ({ row }) => (
        <span className="text-sm">{formatDate(row.getValue("sold_date"))}</span>
      ),
    },
    {
      accessorKey: "purchase_date_snapshot",
      header: "Purchase Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.getValue("purchase_date_snapshot"))}
        </span>
      ),
    },
  ]

  const table = useReactTable({
    data: searchedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4">
      {/* Search and Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by VIN, make, or model..."
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
           
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/_/g, ' ')}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Filters</Label>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  {[selectedMember, selectedMake, selectedYear, selectedModel, startDate, endDate, minProfit, maxProfit]
                    .filter(Boolean).length} active
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 cursor-pointer"
              >
                <X className="mr-1 size-3" />
                Clear
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {!isMemberView && (
              <div className="space-y-2">
                <Label htmlFor="member-filter" className="text-sm">Member</Label>
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger id="member-filter" className="cursor-pointer">
                    <SelectValue placeholder="All members" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5">
                      <Input
                        placeholder="Search members..."
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="h-8"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <SelectItem value="all">All members</SelectItem>
                    {filteredMembers.map((member) => (
                      <SelectItem key={member.user_id} value={member.user_id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="make-filter" className="text-sm">Make</Label>
              <Select value={selectedMake} onValueChange={setSelectedMake}>
                <SelectTrigger id="make-filter" className="cursor-pointer">
                  <SelectValue placeholder="All makes" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1.5">
                    <Input
                      placeholder="Search makes..."
                      value={makeSearch}
                      onChange={(e) => setMakeSearch(e.target.value)}
                      className="h-8"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <SelectItem value="all">All makes</SelectItem>
                  {filteredMakes.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-filter" className="text-sm">Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="model-filter" className="cursor-pointer">
                  <SelectValue placeholder="All models" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1.5">
                    <Input
                      placeholder="Search models..."
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      className="h-8"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <SelectItem value="all">All models</SelectItem>
                  {filteredModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate || endDate ? (
                      `${startDate || '...'} - ${endDate || '...'}`
                    ) : (
                      'Pick a date range'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date" className="text-sm">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date" className="text-sm">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-profit" className="text-sm">Min Profit</Label>
              <Input
                id="min-profit"
                type="number"
                placeholder="$0"
                value={minProfit}
                onChange={(e) => setMinProfit(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-profit" className="text-sm">Max Profit</Label>
              <Input
                id="max-profit"
                type="number"
                placeholder="$100,000"
                value={maxProfit}
                onChange={(e) => setMaxProfit(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={applyFilters} 
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Column Visibility */}
      <div className="flex items-center justify-end space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer">
              Columns <ChevronDown className="ml-2 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id.replace(/_/g, ' ')}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No sales found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="page-size" className="text-sm font-medium">
            Show
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-20 cursor-pointer" id="page-size">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            of {table.getFilteredRowModel().rows.length} row(s)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Page</span>
            <span className="font-medium">
              {table.getState().pagination.pageIndex + 1}
            </span>
            <span className="text-muted-foreground">of</span>
            <span className="font-medium">{table.getPageCount()}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <SaleDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedSale(null)
          }}
          sale={selectedSale}
        />
      )}
    </div>
  )
}
