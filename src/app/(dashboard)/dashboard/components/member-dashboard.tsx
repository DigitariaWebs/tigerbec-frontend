"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Car, Package, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { membersApi } from "@/lib/api/members";
import { useRouter } from "next/navigation";

interface DashboardData {
  member: { id: string; name: string; email: string };
  cars: { total: number; inInventory: number; sold: number };
  financial: {
    totalInvestment: number;
    totalRevenue: number;
    totalGrossProfit: number;
    totalNetProfit: number;
    totalFranchiseFees: number;
    totalAdditionalExpenses: number;
    profitMargin: number;
    netProfitMargin: number;
  };
  recentSales: Array<{
    id: string;
    make_snapshot: string;
    model_snapshot: string;
    year_snapshot: number;
    sold_price: number;
    sold_date: string;
    profit: number;
  }>;
  tasks: {
    total: number;
    todo: number;
    in_progress: number;
    completed: number;
    overdue: number;
  };
  recentTasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    due_date?: string;
  }>;
}

export function MemberDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardData = await membersApi.getMyDashboard();
        setData(dashboardData);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading dashboard: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const statusColors: Record<string, string> = {
    TODO: "bg-slate-500",
    IN_PROGRESS: "bg-blue-500",
    COMPLETED: "bg-green-500",
    CANCELLED: "bg-red-500",
  };

  const priorityColors: Record<string, string> = {
    LOW: "border-slate-300",
    MEDIUM: "border-yellow-500",
    HIGH: "border-orange-500",
    URGENT: "border-red-500",
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {data.member.name}!</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your car sales and tasks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.financial.totalInvestment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.cars.total} car{data.cars.total !== 1 ? 's' : ''} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${data.financial.totalNetProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.financial.netProfitMargin.toFixed(1)}% net margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cars in Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.cars.inInventory}</div>
            <p className="text-xs text-muted-foreground">
              {data.cars.sold} sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.tasks.todo + data.tasks.in_progress}</div>
            <p className="text-xs text-muted-foreground">
              {data.tasks.overdue > 0 && (
                <span className="text-red-500">{data.tasks.overdue} overdue</span>
              )}
              {data.tasks.overdue === 0 && "All on track"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales & Tasks */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Your latest car sales</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentSales.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sales yet</p>
            ) : (
              <div className="space-y-4">
                {data.recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {sale.year_snapshot} {sale.make_snapshot} {sale.model_snapshot}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sold on {new Date(sale.sold_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-semibold">${sale.sold_price.toLocaleString()}</p>
                      <p className={`text-xs ${sale.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {sale.profit >= 0 ? '+' : ''}${sale.profit.toLocaleString()} profit
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your upcoming tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks yet</p>
            ) : (
              <div className="space-y-3">
                {data.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 border-l-2 pl-3 ${priorityColors[task.priority] || 'border-slate-300'}`}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${statusColors[task.status]} text-white`}
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Task Overview</CardTitle>
          <CardDescription>Your task completion statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
              <p className="text-2xl font-bold">{data.tasks.total}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">To Do</p>
              <p className="text-2xl font-bold text-slate-600">{data.tasks.todo}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{data.tasks.in_progress}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">{data.tasks.completed}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
