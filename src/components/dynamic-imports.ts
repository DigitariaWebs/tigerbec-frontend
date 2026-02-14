import dynamic from 'next/dynamic'
import React from 'react'

// Heavy components that should be dynamically imported
export const DynamicThemeCustomizer = dynamic(() => import('./theme-customizer').then(mod => ({ default: mod.ThemeCustomizer })), {
  ssr: false,
  loading: () => React.createElement('div', { className: "h-8 w-8 animate-pulse bg-muted rounded" })
})

export const DynamicColorPicker = dynamic(() => import('./color-picker').then(mod => ({ default: mod.ColorPicker })), {
  ssr: false,
  loading: () => React.createElement('div', { className: "h-8 w-8 animate-pulse bg-muted rounded" })
})

export const DynamicMap = dynamic(() => import('./ui/map').then(mod => ({ default: mod.Map })), {
  ssr: false,
  loading: () => React.createElement('div', { className: "w-full h-full flex items-center justify-center bg-muted/50 rounded-2xl animate-pulse" }, 
    React.createElement('div', { className: "text-center" },
      React.createElement('div', { className: "h-12 w-12 bg-primary/20 rounded-full mx-auto mb-3 animate-bounce" }),
      React.createElement('p', { className: "text-sm text-muted-foreground" }, "Chargement de la carte...")
    )
  )
})

