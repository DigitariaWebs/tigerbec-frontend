"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Circle, ListTodo, AlertCircle } from "lucide-react"
import { format } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { tasksApi } from "@/lib/api/tasks"

interface Task {
  id: string
  title: string
  description?: string
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  due_date?: string
}

const priorityColors = {
  LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
}

const statusIcons = {
  TODO: Circle,
  IN_PROGRESS: AlertCircle,
  COMPLETED: CheckCircle2,
  CANCELLED: Circle,
}

export function TasksCard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const memberUser = localStorage.getItem('member_user')
        if (!memberUser) {
          setLoading(false)
          return
        }

        const user = JSON.parse(memberUser)
        const tasksData = await tasksApi.getTasksByMemberId(user.user_id)
        // Show only incomplete tasks
        const incompleteTasks = tasksData.filter(
          (task: Task) => task.status !== "COMPLETED" && task.status !== "CANCELLED"
        )
        setTasks(incompleteTasks)
      } catch (error) {
        console.error("Failed to load tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="size-5" />
          My Tasks
        </CardTitle>
        <CardDescription>
          {tasks.length} pending {tasks.length === 1 ? 'task' : 'tasks'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="size-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">All tasks completed!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Great job staying on top of things
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {tasks.map((task) => {
                const StatusIcon = statusIcons[task.status]
                const isOverdue = task.due_date && new Date(task.due_date) < new Date()

                return (
                  <div
                    key={task.id}
                    className="flex flex-col gap-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <StatusIcon 
                        className={`size-5 shrink-0 mt-0.5 ${
                          task.status === "COMPLETED" 
                            ? "text-green-500" 
                            : task.status === "IN_PROGRESS"
                            ? "text-blue-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={priorityColors[task.priority]}
                      >
                        {task.priority}
                      </Badge>
                      
                      <Badge variant="outline">
                        {task.status.replace("_", " ")}
                      </Badge>
                      
                      {task.due_date && (
                        <Badge 
                          variant={isOverdue ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {isOverdue && "⚠️ "}
                          Due: {format(new Date(task.due_date), "MMM d")}
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
