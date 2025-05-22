"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "./edit-profile-dialog";
import { formatDistanceToNow } from "date-fns";
import { PencilIcon } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    id: string;
    username: string;
    full_name?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatar_url?: string;
    banner_url?: string;
    created_at: string;
  };
  isOwnProfile: boolean;
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="h-48 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
        {profile.banner_url && (
          <img
            src={profile.banner_url}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-background bg-violet-600 overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl text-white">
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile.full_name || profile.username}
                  </h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditDialogOpen(true)}
                    className="ml-auto"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {profile.bio && (
                <p className="mt-2 text-muted-foreground">{profile.bio}</p>
              )}

              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-500 hover:underline"
                  >
                    {profile.website}
                  </a>
                )}
                <div className="flex items-center gap-1">
                  <span>Joined {formatDistanceToNow(new Date(profile.created_at))} ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        profile={profile}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
} 