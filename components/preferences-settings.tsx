"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Moon, Monitor, Sun, Volume2, VolumeX, Eye, Bot, Film } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PreferencesSettingsProps {
  onChangesMade: () => void
}

export function PreferencesSettings({ onChangesMade }: PreferencesSettingsProps) {
  const [theme, setTheme] = useState("dark")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoplayVideos, setAutoplayVideos] = useState(true)
  const [contentDensity, setContentDensity] = useState("medium")
  const [aiSuggestions, setAiSuggestions] = useState(true)

  const handleThemeChange = (value: string) => {
    setTheme(value)
    onChangesMade()
  }

  const handleContentDensityChange = (value: string) => {
    setContentDensity(value)
    onChangesMade()
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Accordion type="single" collapsible defaultValue="appearance" className="w-full">
        <AccordionItem value="appearance" className="border-b border-zinc-800/50">
          <AccordionTrigger className="py-4 px-5 bg-zinc-800/20 hover:bg-zinc-800/30 rounded-lg font-semibold">
            APPEARANCE
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="space-y-4">
              {/* Theme */}
              <div className="p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Moon className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-zinc-400">Choose your preferred theme</p>
                  </div>
                </div>

                <RadioGroup value={theme} onValueChange={handleThemeChange} className="flex gap-2 mt-2">
                  <div className="flex items-center space-x-2 bg-zinc-800/30 p-3 rounded-lg flex-1">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="h-4 w-4 mr-2 text-zinc-400" />
                      Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-zinc-800/30 p-3 rounded-lg flex-1">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center">
                      <Moon className="h-4 w-4 mr-2 text-zinc-400" />
                      Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-zinc-800/30 p-3 rounded-lg flex-1">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center">
                      <Monitor className="h-4 w-4 mr-2 text-zinc-400" />
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Content Density */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Eye className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">Content density</p>
                    <p className="text-sm text-zinc-400">Choose how densely content is displayed</p>
                  </div>
                </div>
                <Select value={contentDensity} onValueChange={handleContentDensityChange}>
                  <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible defaultValue="media" className="w-full">
        <AccordionItem value="media" className="border-b border-zinc-800/50">
          <AccordionTrigger className="py-4 px-5 bg-zinc-800/20 hover:bg-zinc-800/30 rounded-lg font-semibold">
            MEDIA & SOUND
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="space-y-4">
              {/* Sound */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    {soundEnabled ? (
                      <Volume2 className="h-5 w-5 text-zinc-400" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Sound effects</p>
                    <p className="text-sm text-zinc-400">Enable or disable sound effects</p>
                  </div>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={(checked) => {
                    setSoundEnabled(checked)
                    onChangesMade()
                  }}
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>

              {/* Autoplay Videos */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Film className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">Autoplay videos</p>
                    <p className="text-sm text-zinc-400">Automatically play videos while scrolling</p>
                  </div>
                </div>
                <Switch
                  checked={autoplayVideos}
                  onCheckedChange={(checked) => {
                    setAutoplayVideos(checked)
                    onChangesMade()
                  }}
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible defaultValue="advanced" className="w-full">
        <AccordionItem value="advanced" className="border-b border-zinc-800/50">
          <AccordionTrigger className="py-4 px-5 bg-zinc-800/20 hover:bg-zinc-800/30 rounded-lg font-semibold">
            ADVANCED
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="space-y-4">
              {/* AI Suggestions */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Bot className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium">AI-powered suggestions</p>
                    <p className="text-sm text-zinc-400">Get personalized suggestions based on your interests</p>
                  </div>
                </div>
                <Switch
                  checked={aiSuggestions}
                  onCheckedChange={(checked) => {
                    setAiSuggestions(checked)
                    onChangesMade()
                  }}
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
