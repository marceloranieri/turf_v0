"use client"

import { useState } from "react"

// Simple placeholder page 
export default function EmailSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div>
        <h1 className="text-2xl font-bold">Email Preferences</h1>
        <p className="text-gray-500 mt-1">Manage which emails you receive</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <div>
            <h3 className="font-medium">Marketing Emails</h3>
            <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
          </div>
          <div className="w-12 h-6 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <div>
            <h3 className="font-medium">Newsletter Emails</h3>
            <p className="text-sm text-gray-500">Get our weekly newsletter with the latest updates</p>
          </div>
          <div className="w-12 h-6 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <div>
            <h3 className="font-medium">Notification Emails</h3>
            <p className="text-sm text-gray-500">Receive emails about your account activity</p>
          </div>
          <div className="w-12 h-6 bg-green-500 rounded-full"></div>
        </div>
      </div>
      
      <button 
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Save Preferences
      </button>
      
      <p className="text-sm text-gray-500 pt-4">
        Note: This is a simplified placeholder component. The actual email preferences 
        functionality will be implemented in a future update.
      </p>
    </div>
  )
} 