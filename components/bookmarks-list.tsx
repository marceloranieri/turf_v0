"use client";

import React from "react";

export function BookmarksList() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Your Bookmarks</h2>
      <div className="space-y-4">
        {/* You can replace this with your actual bookmarks data */}
        <p className="text-muted-foreground">
          You don't have any bookmarks yet. Save interesting content to see it here.
        </p>
        
        {/* Uncomment and modify this when you have actual bookmarks data
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="border rounded-lg p-4">
            <h3 className="font-medium">{bookmark.title}</h3>
            <p className="text-sm text-muted-foreground">{bookmark.url}</p>
            <div className="flex justify-end mt-2">
              <button className="text-sm text-red-500 hover:text-red-700">
                Remove
              </button>
            </div>
          </div>
        ))}
        */}
      </div>
    </div>
  );
} 