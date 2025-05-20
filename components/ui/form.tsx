"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Mock Label component for build
const Label = React.forwardRef(({ className, children, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
    {children}
  </label>
));
Label.displayName = "Label";

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn("", className)} {...props} />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} className="flex items-center" {...props} />
))
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props}>
    {children}
  </p>
))
FormMessage.displayName = "FormMessage"

export {
  Label,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
