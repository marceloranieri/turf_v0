'use client'

import React from 'react'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <>{children}</>
}

export default ClientProviders 