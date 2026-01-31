"use client"

import { useQuery } from "@tanstack/react-query"
import { announcementsApi } from "@/lib/api/announcements"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Trophy, AlertCircle, Bell, Expand } from "lucide-react"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

const typeIcons = {
  general: Bell,
  incentive: Trophy,
  alert: AlertCircle,
  celebration: Megaphone,
}

const typeColors = {
  general: "text-blue-600 dark:text-blue-400",
  incentive: "text-green-600 dark:text-green-400",
  alert: "text-red-600 dark:text-red-400",
  celebration: "text-purple-600 dark:text-purple-400",
}

const typeBorderColors = {
  general: "border-blue-200 dark:border-blue-800",
  incentive: "border-green-200 dark:border-green-800",
  alert: "border-red-200 dark:border-red-800",
  celebration: "border-purple-200 dark:border-purple-800",
}

const priorityColors = {
  low: "bg-gray-500",
  normal: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
}

export function AnnouncementsCard() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: () => announcementsApi.getActive(),
    refetchInterval: 60000, // Refetch every minute
  })

  // Sort by priority and date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="size-5" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading announcements...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (announcements.length === 0) {
    return null // Don't show the card if there are no announcements
  }

  return (
    <Card className="relative overflow-hidden  flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="size-5" />
            Announcements
          </div>
          <Badge variant="secondary">{announcements.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className=" ">
            {sortedAnnouncements.map((announcement) => {
              const TypeIcon = typeIcons[announcement.type]
              return (
                <div
                  key={announcement.id}
                  className={`  rounded-lg  bg-card hover:shadow-md transition-shadow`}
                >
                  <div className="space-y-3">
                    {/* Header with Icon and Badge */}
                    

                    {/* Title */}
                    <h3 className="font-bold text-lg leading-tight">
                      {announcement.title}
                    </h3>
                    {/* Content */}
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                    {/* Image */}
                    {announcement.image_url && (
                      <div 
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedImage(announcement.image_url!)}
                      >
                        <img
                          src={announcement.image_url}
                          alt={announcement.title}
                          className="w-full max-h-37 object-cover rounded-md bg-muted/30 transition-opacity group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-md">
                          <div className="bg-white/90 dark:bg-black/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Expand className="size-5 text-foreground" />
                          </div>
                        </div>
                      </div>
                    )}

                     

                    {/* Footer with dates */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t text-xs text-muted-foreground">
                      <span>
                        {format(new Date(announcement.created_at), "MMM d, yyyy")}
                      </span>
                      {announcement.expires_at && (
                        <span className="flex items-center gap-1">
                          <span className="text-orange-500">●</span>
                          Expires {format(new Date(announcement.expires_at), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="relative bg-black">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
