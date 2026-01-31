import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { SectionCards } from "./components/section-cards"
import { CarsCard } from "./components/cars-card"
import { TasksCard } from "./components/tasks-card"
import { AnnouncementsCard } from "./components/announcements-card"

export default function Page() {
  return (
    <>
      {/* Page Title and Description */}
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>
      </div>

      <div className="@container/main px-4 lg:px-6 space-y-6">
        <SectionCards />
        
        {/* Financial Overview and Announcements Row */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AnnouncementsCard />
          </div>
          <div className="lg:col-span-3 ">
            <ChartAreaInteractive />
          </div>
           
        </div>
        
        {/* Cars and Tasks Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <CarsCard />
          <TasksCard />
        </div>
      </div>
    </>
  )
}
