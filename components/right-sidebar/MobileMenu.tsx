"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import SidebarTabs from "./Tabs"
import Timer from "@/components/Timer"

export default function MobileMenu({ nextRefreshAt }: { nextRefreshAt: Date }) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

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
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed right-0 top-0 h-full w-[280px] bg-zinc-900 z-50 shadow-xl"
            >
              <div className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-base font-semibold">Live Activity</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-400 hover:text-white transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>
                <Timer nextRefreshAt={nextRefreshAt} />
                <SidebarTabs />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
} 