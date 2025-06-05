"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Search, UserX, AlertCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface BlockedAccountsProps {
  onChangesMade: () => void
}

// Mock data for blocked accounts
const INITIAL_BLOCKED_ACCOUNTS = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "@alexj",
    avatar: "/diverse-person-portrait.png",
  },
  {
    id: "2",
    name: "Taylor Smith",
    username: "@tsmith",
    avatar: "/diverse-group-conversation.png",
  },
  {
    id: "3",
    name: "Jordan Lee",
    username: "@jlee",
    avatar: "/diverse-group-meeting.png",
  },
]

export function BlockedAccounts({ onChangesMade }: BlockedAccountsProps) {
  const [blockedAccounts, setBlockedAccounts] = useState(INITIAL_BLOCKED_ACCOUNTS)
  const [searchQuery, setSearchQuery] = useState("")

  const handleUnblock = (id: string) => {
    setBlockedAccounts(blockedAccounts.filter((account) => account.id !== id))
    onChangesMade()
  }

  const filteredAccounts = blockedAccounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Accordion type="single" collapsible defaultValue="blocked" className="w-full">
        <AccordionItem value="blocked" className="border-b border-zinc-800/50">
          <AccordionTrigger className="py-4 px-5 bg-zinc-800/20 hover:bg-zinc-800/30 rounded-lg font-semibold">
            BLOCKED ACCOUNTS
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="space-y-4">
              <div className="bg-zinc-800/10 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <UserX className="h-5 w-5 text-zinc-400 mr-2" />
                  <p className="text-sm text-zinc-400">
                    Blocked accounts cannot see your posts, message you, or find you in searches.
                  </p>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Search blocked accounts"
                    className="pl-10 bg-zinc-800/50 border-zinc-700/50 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {filteredAccounts.length > 0 ? (
                  <div className="space-y-2">
                    {filteredAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/30 transition-colors"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={account.avatar || "/placeholder.svg"} alt={account.name} />
                            <AvatarFallback>{account.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-zinc-400">{account.username}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => handleUnblock(account.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Unblock
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    {searchQuery ? (
                      <>
                        <AlertCircle className="h-12 w-12 text-zinc-500 mb-2" />
                        <p className="text-lg font-medium">No matching accounts found</p>
                        <p className="text-sm text-zinc-500 mt-1">Try a different search term</p>
                      </>
                    ) : (
                      <>
                        <UserX className="h-12 w-12 text-zinc-500 mb-2" />
                        <p className="text-lg font-medium">No blocked accounts</p>
                        <p className="text-sm text-zinc-500 mt-1">You haven't blocked any accounts yet</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
