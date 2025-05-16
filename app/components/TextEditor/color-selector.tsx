"use client"

import type { Editor } from "@tiptap/react"
import { Palette } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ColorSelectorProps {
  editor: Editor | null
}

const textColors = [
  { name: "Default", color: "inherit" },
  { name: "Black", color: "#000000" },
  { name: "White", color: "#ffffff" },
  { name: "Gray", color: "#4b5563" },
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Yellow", color: "#eab308" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Purple", color: "#a855f7" },
  { name: "Pink", color: "#ec4899" },
]

const backgroundColors = [
  { name: "Default", color: "inherit" },
  { name: "Black", color: "#000000" },
  { name: "White", color: "#ffffff" },
  { name: "Gray", color: "#f3f4f6" },
  { name: "Red", color: "#fee2e2" },
  { name: "Orange", color: "#ffedd5" },
  { name: "Yellow", color: "#fef9c3" },
  { name: "Green", color: "#dcfce7" },
  { name: "Blue", color: "#dbeafe" },
  { name: "Purple", color: "#f3e8ff" },
  { name: "Pink", color: "#fce7f3" },
]

export default function ColorSelector({ editor }: ColorSelectorProps) {
  if (!editor) {
    return null
  }

  const setTextColor = (color: string) => {
    if (color === "inherit") {
      editor.chain().focus().unsetColor().run()
    } else {
      editor.chain().focus().setColor(color).run()
    }
  }

  const setBackgroundColor = (color: string) => {
    if (color === "inherit") {
      editor.chain().focus().unsetHighlight().run()
    } else {
      editor.chain().focus().setHighlight({ color }).run()
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Palette className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Colors</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Color</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="mt-3">
            <div className="grid grid-cols-5 gap-2">
              {textColors.map((item) => (
                <button
                  key={item.name}
                  className={cn(
                    "h-6 w-6 rounded-md border border-muted",
                    item.color === "inherit" && "bg-gradient-to-br from-slate-100 to-slate-300",
                  )}
                  style={{ backgroundColor: item.color !== "inherit" ? item.color : undefined }}
                  title={item.name}
                  onClick={() => setTextColor(item.color)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="background" className="mt-3">
            <div className="grid grid-cols-5 gap-2">
              {backgroundColors.map((item) => (
                <button
                  key={item.name}
                  className={cn(
                    "h-6 w-6 rounded-md border border-muted",
                    item.color === "inherit" && "bg-gradient-to-br from-slate-100 to-slate-300",
                  )}
                  style={{ backgroundColor: item.color !== "inherit" ? item.color : undefined }}
                  title={item.name}
                  onClick={() => setBackgroundColor(item.color)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
