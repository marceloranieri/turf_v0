"use client";

import { useEffect, useState } from "react";

export default function EnvironmentIndicator() {
  const [environment, setEnvironment] = useState("");
  
  useEffect(() => {
    // Get environment from env variable
    setEnvironment(process.env.NEXT_PUBLIC_ENVIRONMENT || "unknown");
  }, []);
  
  if (!environment || environment === "production") return null;
  
  const bgColor = environment === "development" ? "bg-blue-600" : "bg-purple-600";
  
  return (
    <div className={`fixed top-0 right-0 z-50 px-2 py-1 text-xs text-white ${bgColor}`}>
      {environment.toUpperCase()}
    </div>
  );
} 