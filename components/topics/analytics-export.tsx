"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

interface AnalyticsExportProps {
  data: any[];
  filename?: string;
}

export function AnalyticsExport({ data, filename = "analytics-export" }: AnalyticsExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "csv" | "json") => {
    if (!data || data.length === 0) return;
    
    setIsExporting(true);
    
    try {
      let content: string;
      let mimeType: string;
      let extension: string;
      
      if (format === "csv") {
        // Convert data to CSV
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map((row: any) => {
          return Object.values(row).map(value => {
            // Handle values that might contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(",");
        });
        content = [headers, ...rows].join("\n");
        mimeType = "text/csv";
        extension = "csv";
      } else {
        // JSON format
        content = JSON.stringify(data, null, 2);
        mimeType = "application/json";
        extension = "json";
      }
      
      // Create download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.${extension}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExport("csv")}
        disabled={isExporting || !data?.length}
      >
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleExport("json")}
        disabled={isExporting || !data?.length}
      >
        <Download className="h-4 w-4 mr-2" />
        Export JSON
      </Button>
    </div>
  );
} 