import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ProfileAboutProps {
  profile: {
    username: string;
    full_name?: string;
    bio?: string;
    created_at: string;
    location?: string;
    website?: string;
  };
}

export function ProfileAbout({ profile }: ProfileAboutProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>
            Profile information for {profile.full_name || profile.username}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.bio && (
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-1">Bio</h3>
              <p className="text-zinc-200">{profile.bio}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-zinc-400 mb-1">Joined</h3>
            <p className="text-zinc-200">
              {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
            </p>
          </div>
          
          {profile.location && (
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-1">Location</h3>
              <p className="text-zinc-200">{profile.location}</p>
            </div>
          )}
          
          {profile.website && (
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-1">Website</h3>
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:underline"
              >
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 