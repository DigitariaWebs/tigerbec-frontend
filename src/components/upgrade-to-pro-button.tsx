"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export function UpgradeToProButton() {
  return (
    <Button
      variant="default"
      size="sm"
      className="fixed bottom-4 right-4 z-50 shadow-lg"
      onClick={() => {
        // TODO: Implement upgrade to pro functionality
        console.log("Upgrade to Pro clicked")
      }}
    >
      <Zap className="mr-2 h-4 w-4" />
      Upgrade to Pro
    </Button>
  )
}
