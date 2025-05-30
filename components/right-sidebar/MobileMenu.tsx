"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import SidebarTabs from "./Tabs"
import Timer from "@/components/Timer"

export default function MobileMenu({ nextRefreshAt }: { nextRefreshAt: Date }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (!mounted) return

    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, mounted])

  if (!mounted) return null

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 z-50 bg-zinc-900"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <SidebarTabs />
              </div>
              <div className="p-4 border-t border-zinc-800">
                <Timer targetTime={nextRefreshAt} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 