"use client"

import * as React from "react"

export const Dialog = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const DialogContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const DialogHeader = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const DialogFooter = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const DialogTitle = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const DialogDescription = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const DialogTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
export const DialogClose = () => null
export const DialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const DialogOverlay = () => null
