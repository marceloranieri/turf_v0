"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, Lock, Shield, Trash2, Upload, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function AccountSettings() {
  const { toast } = useToast()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [privateProfile, setPrivateProfile] = useState(false)
  const [directMessagePermission, setDirectMessagePermission] = useState("everyone")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
  })

  const handleTwoFactorToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked)
  }

  const handlePrivateProfileToggle = (checked: boolean) => {
    setPrivateProfile(checked)
  }

  const handleDirectMessageChange = (value: string) => {
    setDirectMessagePermission(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement account update logic
      toast({
        title: "Success",
        description: "Your account settings have been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center p-6 bg-zinc-800/20 rounded-lg border border-zinc-800/50">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-zinc-800">
            <AvatarImage src="/diverse-faces.png" />
            <AvatarFallback className="text-lg">MS</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-white">
              <Upload className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <h2 className="text-xl font-semibold mt-4">Moyo Shiro</h2>
        <p className="text-zinc-400 text-sm">moyoshiro@email.com</p>
      </div>

      {/* Account Section */}
      <Accordion type="single" collapsible defaultValue="account" className="w-full">
        <AccordionItem value="account" className="border-b border-zinc-800/50">
          <AccordionTrigger className="py-4 px-5 bg-zinc-800/20 hover:bg-zinc-800/30 rounded-lg font-semibold">
            ACCOUNT
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <Label className="text-sm text-zinc-400">Email</Label>
                    <p className="font-medium">moyoshiro@email.com</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                  Edit
                </Button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Lock className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <Label className="text-sm text-zinc-400">Password</Label>
                    <p className="font-medium">••••••••••••</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                  Change
                </Button>
              </div>

              {/* 2FA */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <Label className="text-sm text-zinc-400">Two-Factor Authentication</Label>
                    <p className="font-medium">{twoFactorEnabled ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleTwoFactorToggle}
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <Label className="text-sm text-zinc-400">Delete Account</Label>
                    <p className="font-medium text-red-400">Permanently delete your account and all data</p>
                  </div>
                </div>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription className="text-zinc-400">
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive">Delete Account</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Privacy Section */}
      <Accordion type="single" collapsible defaultValue="privacy" className="w-full">
        <AccordionItem value="privacy" className="border-b border-zinc-800/50">
          <AccordionTrigger className="py-4 px-5 bg-zinc-800/20 hover:bg-zinc-800/30 rounded-lg font-semibold">
            PRIVACY
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="space-y-4">
              {/* Private Profile */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <Label className="text-sm text-zinc-400">Private profile</Label>
                    <p className="font-medium">
                      {privateProfile ? "Only followers can see your posts" : "Everyone can see your posts"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={privateProfile}
                  onCheckedChange={handlePrivateProfileToggle}
                  className="data-[state=checked]:bg-violet-600"
                />
              </div>

              {/* Cookie Settings */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm text-zinc-400">Cookie settings</Label>
                    <p className="font-medium">Manage how we use cookies</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                  Customize
                </Button>
              </div>

              {/* Direct Message */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/10 hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center mr-3">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <Label className="text-sm text-zinc-400">Direct message</Label>
                    <p className="font-medium">Choose who can send you direct messages</p>
                  </div>
                </div>
                <Select value={directMessagePermission} onValueChange={handleDirectMessageChange}>
                  <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="nobody">Nobody</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  )
}

export { AccountSettings as default };
